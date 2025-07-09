import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email',
    example: 'abc@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;
  

  @ApiProperty({
    description: 'Name',
    example: 'shaheer',
    required: false,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Passeord',
    example: 'abc123@',
    required: false,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
