import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repo';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoginUserDto } from '../controller/dtos/signin-user.dto';
import { updatePasswordDto } from '../controller/dtos/update-passord.dto';
import { ConfigService } from '@nestjs/config';
import { SignUpUserDto } from '../controller/dtos/signup-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userrepo: UserRepository,
    private eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async Getall() {
    try {
      return await this.userrepo.getAll();
    } catch (error) {
      throw error;
    }
  }
  async signup(signUpUserDTO: SignUpUserDto) {
    try {
      const { firstName, lastName, email, password } = signUpUserDTO;
      const existingUser = await this.userrepo.getByEmail(email);
      if (existingUser) throw new ConflictException('Email already in use');
      console.log(`sign up :email: ${email} Psssword: ${password}`);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userrepo.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      console.log(user.id);
      const extractUser = await this.userrepo.getbyId(user.id);
      return { Success: true, message: 'User Signup successfully' };
    } catch (error) {
      throw error;
    }
  }

  async signin(logindto: LoginUserDto) {
    const { email, password } = logindto;
    const existingUser = await this.userrepo.getByEmail(email);

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: existingUser._id };
    console.log(payload);
    const token = await this.jwtService.sign(
      { payload },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRY'),
      },
    );
    return {
      accessToken: token,
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

      // Emit or send email with the link
      await this.eventEmitter.emit('forgot.password', {
        email,
        link: resetLink,
      });

      return { success: true, message: 'Password reset link sent to email.' };
    } catch (error) {
      console.error('Error in forgotPassword:', error);
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

  async resetPassword(dto: updatePasswordDto) {
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
}
