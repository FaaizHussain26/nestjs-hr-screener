import { ApiProperty } from '@nestjs/swagger';
import {
    IsOptional,
    IsString
} from 'class-validator';

export class DeleteQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Enter id to delete',
    example: '6awhj23224343',
    required: false,
  })
  id: string;

  @IsOptional()
  @ApiProperty({
    description: 'Select the option',
    enum: ['softDelete', 'hardDelete'],
    example: 'softDelete',
    required: false,
  })
  deleteOption?: 'softDelete' | 'hardDelete';
}
