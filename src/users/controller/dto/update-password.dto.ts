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
  currentpassword: string;

  @ApiProperty({
    description: 'Password',
    example: 'abc123@',
    required: false,
  })
  @IsString()
  @MinLength(6)
  newpassword: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  confirmPassword: string;
}
