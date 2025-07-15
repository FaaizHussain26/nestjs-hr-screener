import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserService } from '../services/user.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegistrationUserDto } from './dtos/registration-user.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UpdateProfileDto } from './dtos/update-user-profile.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('Authentication')
export class UserController {
  constructor(private readonly userservice: UserService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() payload: RegistrationUserDto) {
    return await this.userservice.registration(payload);
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() payload: LoginUserDto) {
    return await this.userservice.login(payload);
  }
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    return await this.userservice.forgotPassword(payload.email);
  }
  @HttpCode(HttpStatus.OK)
  @Get('verify-reset-token')
  async verifyResetToken(@Query('token') token: string) {
    return await this.userservice.verifyForgotPasswordToken(token);
  }
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await this.userservice.resetPassword(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Put('update-profile/:id')
  async updateprofile(
    @Param('id') id: string,
    @Body() payload: UpdateProfileDto,
  ) {
    return await this.userservice.updateProfile(id, payload);
  }
  @HttpCode(HttpStatus.OK)
  @Put('update-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() payload: UpdatePasswordDto,
  ) {
    return await this.userservice.updatePassword(id, payload);
  }
}
