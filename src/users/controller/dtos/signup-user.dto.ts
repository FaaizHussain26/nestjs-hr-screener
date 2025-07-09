import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpUserDto {
  @ApiProperty({
    description: 'first Name',
    example: 'John',
    required: false,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last Name',
    example: 'Smith',
    required: false,
  })
  @IsString()
  lastName: string;
  @ApiProperty({
    description: 'Email',
    example: 'johnsmithgmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Passeord',
    example: 'abc123@',
    required: false,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
