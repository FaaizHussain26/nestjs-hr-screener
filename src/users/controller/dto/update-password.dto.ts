import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Password',
    example: 'abc123@',
    required: false,
  })
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @ApiProperty({
    description: 'Password',
    example: 'abc123@',
    required: false,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  confirmPassword: string;
}
