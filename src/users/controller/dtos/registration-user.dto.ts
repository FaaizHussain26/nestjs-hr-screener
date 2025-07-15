import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegistrationUserDto {
  @ApiProperty({
    description: 'first Name',
    example: 'John',
    required: true,
  })

  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last Name',
    example: 'Smith',
    required: true,
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
    description: 'Password',
    example: 'abc123@',
    required: true,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
