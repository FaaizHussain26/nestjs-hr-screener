import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../controller/dtos/create-user.dto';
import { UserRepository } from '../repositories/user.repo';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoginUserDto } from '../controller/dtos/signin.dto';
import { updatePasswordDto } from '../controller/dtos/update-passord.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserService {
  constructor(
    private readonly userrepo: UserRepository,
    private eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,  
  ) {}

  async Getall(){
    try{
      return await this.userrepo.getAll()
    }catch (error) {
      throw error;
    }

  }
  async signup(createuserdto: CreateUserDto) {
    try {
      const { email, name, password } = createuserdto;
      const existingUser = await this.userrepo.getByEmail(email);
      if (existingUser) throw new ConflictException('Email already in use');
      console.log(`sign up :email: ${email} PAssword: ${password}`);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userrepo.create({
        name,
        email,
        password: hashedPassword,
      });
      // await this.eventEmitter.emit('user.registered', { email });
      return user;
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
      { secret: 'shaheer', expiresIn: '6h' },
    );
    console.log(`Login successful : ${token}`);
    return {
      accessToken: token,
    };
  }

  // async forgotpassword(email: string) {
  //   const existingUser = await this.userrepo.getByEmail(email);
  //   if (existingUser) {
  //     const token = await this.jwtService.sign(
  //     { email },
  //     { secret: 'shaheer', expiresIn: '6h' },
  //   );
  //     await this.eventEmitter.emit('forgot.password', { email });
  //     console.log('forget password email sended');
  //     return { success: true, message: 'OTP Sended successfully' };
  //   } else {
  //     return { success: false, message: 'Error Occured while Sending' };
  //   }
  // }


  // async forgotPassword(email: string) {
  //   try {
  //     const existingUser = await this.userrepo.getByEmail(email);

  //     if (!existingUser) {
  //       return { success: false, message: 'User not found with this email.' };
  //     }
  //      const jwtSecret = this.configService.get<string>('JWT_SECRET');
  //     const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

  //     const token = await this.jwtService.signAsync(
  //       { email },
  //       { secret: jwtSecret, expiresIn: jwtExpiresIn },
  //     );

  //     // Emit event with email and token (you may want to include token in email)
  //     await this.eventEmitter.emit('forgot.password', { email, token });

  //     console.log('Forgot password email sent');
  //     return { success: true, message: 'Password reset token sent successfully.', token };
  //   } catch (error) {
  //     console.error('Error in forgotPassword:', error);
  //     return { success: false, message: 'Something went wrong. Please try again later.' };
  //   }
  // }

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
    const frontendBaseUrl = this.configService.get<string>('FRONTEND_URL')

    const resetLink = `${frontendBaseUrl}/reset-password?token=${token}`;

    // Emit or send email with the link
    await this.eventEmitter.emit('forgot.password', { email, link: resetLink });

    return { success: true, message: 'Password reset link sent to email.' };
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return { success: false, message: 'Server error' };
  }
}


// async verifyForgotPasswordToken(token: string) {
//   try {
//     const jwtSecret = this.configService.get<string>('JWT_SECRET');
//     const decoded = await this.jwtService.verifyAsync(token, { secret: jwtSecret });
//     return { success: true, email: decoded.email };
//   } catch {
//     return { success: false, message: 'Invalid or expired token.' };
//   }
// }


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
//   async resetPassword(token: string, dto: updatePasswordDto) {

//         try {
//       const decoded = await this.jwtService.verifyAsync(token, {
//         secret: this.configService.get<string>('JWT_SECRET'),
//       });
//     const { newpassword } = dto;
    
//       const user = await this.userrepo.getByEmail(decoded.email);
//       if (!user) {
//         return { success: false, message: 'User not found' };
//       }
    
//     const hashed = await bcrypt.hash(dto.newpassword, 10);
//     user.password = hashed;

//     await this.userrepo.create(user);
//     console.log(`update password: New paseord is: ${newpassword}`);
//     return { message: 'Password updated successfully' };
//   }
//     catch {
//       return { success: false, message: 'Invalid or expired token.' };
//     }
// }

async resetPassword(dto: updatePasswordDto) {
  try {
    const {token,newpassword} =dto
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const decoded = await this.jwtService.verifyAsync(token, { secret: jwtSecret });

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
