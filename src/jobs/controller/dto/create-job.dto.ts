import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the job position.',
    example: 'Software Engineer',
    required: true,
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The required experience for the job position.',
    example: '3',
    required: true,
  })
  experience: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'A brief summary of the job position.',
    example:
      'Looking for a skilled software engineer with experience in Node.js.',
    required: false,
  })
  summary?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Detailed description of the job position.',
    example:
      'We are looking for a software engineer with expertise in Node.js and MongoDB.',
    required: true,
  })
  description: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Detailed description of the job position.',
    example:['Node.js', 'TypeScript', 'MongoDB'],
    required: true,
  })
  skills: string[];

  @IsBoolean()
  @ApiProperty({
    description: 'Check the job is active or not',
    example:true,
    required: false,
  })
  isActive: boolean;
}
