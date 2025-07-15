import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { RegistrationUserDto } from './registration-user.dto';

class SignUpUserWithoutPasswordDto extends OmitType(RegistrationUserDto, [
  'password',
] as const) {}

export class UpdateProfileDto extends PartialType(
  SignUpUserWithoutPasswordDto,
) {
  @ApiProperty({
    description: 'PhoneNumber',
    example: '+92333333333',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Address',
    example: 'united state',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'image',
    example: 'imahge_url',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'isActive',
    example: 'false',
    required: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
