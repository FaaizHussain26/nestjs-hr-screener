import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserService } from '../services/user.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegistrationUserDto } from './dto/registration-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-user-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../entities/user.schema';
import { AuthUser } from 'src/common/decorator/auth.decorator';

@Controller('')
@ApiBearerAuth()
@ApiTags('Users')
export class UserController {
  constructor(private readonly userservice: UserService) {}

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    const parsedPage = page ? Number(page) : 1;
    const parsedLimit = limit ? Number(limit) : 10;
    const parsedIsActive =
      typeof isActive === 'string' ? isActive === 'true' : undefined;
    return await this.userservice.getAll({
      page: parsedPage,
      limit: parsedLimit,
      search,
      role,
      isActive: parsedIsActive,
    });
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string) {
    return await this.userservice.getById(id);
  }

  @Post('users')
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateUserDto) {
    return await this.userservice.create(dto);
  }

  @Patch('users/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.userservice.update(id, dto);
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return await this.userservice.delete(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('auth/register')
  async register(@Body() payload: RegistrationUserDto) {
    return await this.userservice.registration(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  async login(@Body() payload: LoginUserDto) {
    return await this.userservice.login(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('auth/forgot-password')
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    return await this.userservice.forgotPassword(payload.email);
  }

  @HttpCode(HttpStatus.OK)
  @Get('auth/verify-reset-token')
  async verifyResetToken(@Query('token') token: string) {
    return await this.userservice.verifyForgotPasswordToken(token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('auth/reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await this.userservice.resetPassword(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Put('auth/update-profile')
  @UseGuards(JwtAuthGuard)
  async updateprofile(
    @AuthUser() user: User,
    @Body() payload: UpdateProfileDto,
  ) {
    return await this.userservice.updateProfile(user, payload);
  }

  @HttpCode(HttpStatus.OK)
  @Put('auth/update-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Param('id') id: string,
    @Body() payload: UpdatePasswordDto,
  ) {
    return await this.userservice.updatePassword(id, payload);
  }
}
