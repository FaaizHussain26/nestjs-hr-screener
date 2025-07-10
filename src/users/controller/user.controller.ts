import { Controller, Post, Body, Query, Get, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserService } from '../services/user.service';
import { LoginUserDto } from './dtos/signin-user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { updatePasswordDto } from './dtos/update-passord.dto';
import { SignUpUserDto } from './dtos/signup-user.dto';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('Authentication')
export class UserController {
  constructor(private readonly userservice: UserService) {}
  @Get('/')
  Getall() {
    return this.userservice.Getall();
  }
  @HttpCode(201)
  @Post('signup')
  signup(@Body() signUpUserDTO: SignUpUserDto) {
    return this.userservice.signup(signUpUserDTO);
  }
  @HttpCode(200)
  @Post('signin')
  signin(@Body() logindto: LoginUserDto) {
    return this.userservice.signin(logindto);
  }
  @Post('forgotPassword')
  forgotpassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userservice.forgotPassword(forgotPasswordDto.email);
  }

  @Get('verify-reset-token')
  async verifyResetToken(@Query('token') token: string) {
    return this.userservice.verifyForgotPasswordToken(token);
  }

  @Post('resetpassword')
  async updatepassword(@Body() updatepassword: updatePasswordDto) {
    return this.userservice.resetPassword(updatepassword);
  }
}
