import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repo';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoginUserDto } from '../controller/dtos/login-user.dto';
import { ResetPasswordDto } from '../controller/dtos/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import { RegistrationUserDto } from '../controller/dtos/registration-user.dto';
import { UpdateProfileDto } from '../controller/dtos/update-user-profile.dto';
import { Types } from 'mongoose';
import { UpdatePasswordDto } from '../controller/dtos/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userrepo: UserRepository,
    private eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // async Getall() {
  //   try {
  //     return await this.userrepo.getAll();
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  async registration(registrationUserDto: RegistrationUserDto) {
    try {
      const { firstName, lastName, email, password } = registrationUserDto;
      const existingUser = await this.userrepo.getByEmail(email);
      if (existingUser) throw new ConflictException('Email already in use');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userrepo.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      const extractUser = await this.userrepo.getbyId(user.id);
      return {
        Success: true,
        message: 'User Signup successfully',
        extractUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(logindto: LoginUserDto) {
    const { email, password } = logindto;
    const existingUser = await this.userrepo.getByEmail(email);

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: existingUser._id };
    const token = await this.jwtService.sign(
      { payload },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRY'),
      },
    );
    return {
      accessToken: token,
      existingUser,
    };
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userrepo.getByEmail(email);
      if (!user) {
        return { success: false, message: 'User not found with this email.' };
      }

      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const jwtExpiresIn = '15m';

      const token = await this.jwtService.signAsync(
        { email },
        { secret: jwtSecret, expiresIn: jwtExpiresIn },
      );
      const frontendBaseUrl = this.configService.get<string>('FRONTEND_URL');

      const resetLink = `${frontendBaseUrl}/reset-password?token=${token}`;

      const emailSend = await this.eventEmitter.emit('forgot.password', {
        email,
        link: resetLink,
      });
      if (!emailSend) {
        return { success: false, message: 'Email not send.' };
      }
      return {
        success: true,
        message: 'Password reset link sent to your email.',
      };
    } catch (error) {
      return { success: false, message: 'Server error' };
    }
  }

  async verifyForgotPasswordToken(token: string) {
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });
      return { success: true, email: decoded.email };
    } catch (error) {
      return { success: false, message: 'Invalid or expired token.' };
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const { token, newpassword } = dto;
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });

      const user = await this.userrepo.getByEmail(decoded.email);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const hashedPassword = await bcrypt.hash(newpassword, 10);
      user.password = hashedPassword;

      await this.userrepo.create(user);

      return { success: true, message: 'Password updated successfully.' };
    } catch (error) {
      return { success: false, message: 'Invalid or expired token.' };
    }
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return { success: false, message: 'Invalid user ID' };
      }
      const existingUser = await this.userrepo.getbyId(id);
      if (!existingUser) {
        return { success: false, message: 'User not found' };
      }
      return await this.userrepo.updateProfile(id, dto);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return { success: false, message: 'Invalid user ID' };
      }
      const { currentpassword, newpassword } = dto;
      const user = await this.userrepo.getbyId(id);
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      const comparePassword = await bcrypt.compare(
        currentpassword,
        user.password,
      );
      if (!comparePassword) {
        return { success: false, message: 'Old Password is not correct' };
      }
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      user.password = hashedPassword;

      // await this.userrepo.create(user);
      await this.userrepo.updateProfile(id, user);

      return { success: true, message: 'Password updated successfully.' };
    } catch (error) {
      return { success: false, message: 'Invalid or expired token.' };
    }
  }
}
