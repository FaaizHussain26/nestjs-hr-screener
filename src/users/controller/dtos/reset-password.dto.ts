import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
   @ApiProperty({
    description: 'token',
    example: '',
    required: false,
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Password',
    example: 'abc123@',
    required: false,
  })
  @IsString()
  @MinLength(6)
  newpassword: string;
}
