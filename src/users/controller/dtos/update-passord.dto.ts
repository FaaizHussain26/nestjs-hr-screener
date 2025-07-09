import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class updatePasswordDto {
   @ApiProperty({
    description: 'token',
    example: '',
    required: false,
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Passeord',
    example: 'abc123@',
    required: false,
  })
  @IsString()
  @MinLength(6)
  newpassword: string;
}
