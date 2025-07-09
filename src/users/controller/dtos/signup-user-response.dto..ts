import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  email: string;
  name: string;
  password: string;
}
