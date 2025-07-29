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
import { LoginUserDto } from '../controller/dto/login-user.dto';
import { ResetPasswordDto } from '../controller/dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import { RegistrationUserDto } from '../controller/dto/registration-user.dto';
import { UpdateProfileDto } from '../controller/dto/update-user-profile.dto';
import { Types } from 'mongoose';
import { UpdatePasswordDto } from '../controller/dto/update-password.dto';
import { User } from '../entities/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userrepo: UserRepository,
    private eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }) {
    return await this.userrepo.findAllPaginatedAndFiltered(query);
  }
  async getById(id: string) {
    return await this.userrepo.getbyId(id);
  }
  async create(dto: CreateUserDto) {
    return await this.userrepo.create(dto);
  }
  async update(id: string, dto: UpdateUserDto) {
    return await this.userrepo.update(id, dto);
  }
  async delete(id: string) {
    return await this.userrepo.delete(id);
  }

  async registration(payload: RegistrationUserDto) {
    try {
      const { firstName, lastName, email, password } = payload;
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
        success: true,
        message: 'User registered successfully',
        extractUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(payload: LoginUserDto) {
    const { email, password } = payload;
    const existingUser = await this.userrepo.getByEmail(email);

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.sign(
      {
        sub: existingUser._id,
        data: existingUser,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRY'),
      },
    );
    return {
      accessToken: token,
      user: existingUser,
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

  async resetPassword(payload: ResetPasswordDto) {
    try {
      const { token, newpassword } = payload;
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

      const passworReset = await this.userrepo.updateProfile(user.id, user);

      return { success: true, message: 'Password updated successfully.' };
    } catch (error) {
      return { success: false, message: 'Invalid or expired token.' };
    }
  }

  async updateProfile(user: User, payload: UpdateProfileDto) {
    try {
      const existingUser = await this.userrepo.getbyId(user._id as string);

      if (!existingUser) {
        return { success: false, message: 'User not found' };
      }

      const updatedUser = await this.userrepo.updateProfile(
        user._id as string,
        payload as any,
      );

      return {
        success: true,
        message: 'Profile updated successfully.',
        user: updatedUser,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updatePassword(id: string, payload: UpdatePasswordDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return { success: false, message: 'Invalid user ID' };
      }
      const { currentpassword, newpassword } = payload;
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
      await this.userrepo.updateProfile(id, user);

      return { success: true, message: 'Password updated successfully.' };
    } catch (error) {
      return { success: false, message: 'Invalid or expired token.' };
    }
  }

  async getUserById(id: string) {
    return await this.userrepo.getbyId(id);
  }
}
