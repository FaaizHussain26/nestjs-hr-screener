import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  IsArray,
  IsUrl,
} from 'class-validator';

export class CreateShortlistedCvDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the applicant',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number in international format',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'Software Engineer',
    description: 'Position applied for',
  })
  @IsString()
  position: string;

  @ApiProperty({ example: 5, description: 'Years of experience' })
  @IsNumber()
  experience: number;

  @ApiProperty({
    example: ['JavaScript', 'NestJS', 'TypeScript'],
    description: 'List of skills',
  })
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @ApiProperty({
    example: 'B.Sc. in Computer Science',
    description: 'Educational qualification',
  })
  @IsString()
  education: string;

  @ApiProperty({
    example: 'https://example.com/resume.pdf',
    description: 'Link to the resume',
  })
  @IsUrl()
  resumeLink: string;
}
