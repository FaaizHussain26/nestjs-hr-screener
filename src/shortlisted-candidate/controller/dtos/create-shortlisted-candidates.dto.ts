import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsObject } from 'class-validator';

export class ShortlistedCandidateDto {
  @ApiProperty({
    description: 'Name of the applicant',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  applicant_name: string;

  @ApiProperty({
    description: 'Job the applicant matched to',
    example: 'No',
    required: true,
  })
  @IsString()
  job_matched: string;

  @ApiProperty({
    description: 'Summary of the match',
    example: 'yest',
    required: true,
  })
  @IsString()
  summary_match: string;

  @ApiProperty({
    description: 'List of matched skills',
    example: ['Node.js', 'TypeScript', 'MongoDB'],
    required: true,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  matched_skills: string[];

  @ApiProperty({
    description: 'Experience object of the applicant',
    example: { match: 'No', years_found: 0 },
    required: true,
  })
  @IsObject()
  experience: object;

  @ApiProperty({
    description: 'List of bonus skill matches',
    example: ['GraphQL', 'Docker'],
    required: true,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  bonus_matches: string[];

  @ApiProperty({
    description: 'Overall match score',
    example: 87.5,
    required: true,
  })
  @IsNumber()
  match_score: number;

  @ApiProperty({
    description: 'List of job titles matched',
    example: ['Backend Developer', 'Software Engineer'],
    required: true,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  jobs_matched: string[];

  @ApiProperty({
    description: 'Summary',
    example: 'Motivated professional who has a strong passion for using technology to create interesting digital experiences. Skilled in many different technologies, such as HTML, CSS, JavaScript, and others, and passionate about developing solutions that put the needs of users first. Eager to take on difficult challenges and offer creative solutions to support corporate goals. Looking for chances with innovative and creative firms that value creativity and innovation',
    required: true,
  })
  @IsString()
  applicant_summary: string;

  @ApiProperty({
    description: 'email',
    example: 'abc@gmail.com',
    required: true,
  })
  @IsString()
  applicant_email: string;

  @ApiProperty({
    description: 'Phone Number',
    example: '+92 333 3333333',
    required: true,
  })
  @IsString()
  applicant_phone: string;
}
