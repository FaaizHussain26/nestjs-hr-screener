import { PartialType } from '@nestjs/mapped-types';
import { SignUpUserDto } from './signup-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(SignUpUserDto) {
  @ApiProperty({
    description: 'PhoneNumber',
    example: '+92333333333',
    required: false,
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Address',
    example: 'united state',
    required: false,
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'image',
    example: 'imahge_url',
    required: false,
  })
  @IsString()
  image: string;

  @ApiProperty({
    description: 'isActive',
    example: 'false',
    required: false,
  })
  @IsString()
  isActive: boolean;
}
