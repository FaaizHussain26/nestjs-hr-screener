import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';

import { ShortlistedCandidateDto } from './dtos/create-shortlisted-candidates.dto';
import { ShortlistedCandidatesService } from '../services/shortlisted-candidates.service';
import { PaginationQueryDto } from 'src/common/pagination and filter/dtos/pagination-query.dto';

@Controller('shortlisted-candidates')
export class ShortlistedCandidatesController {
  constructor(
    private readonly candidatesService: ShortlistedCandidatesService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Get('/')
  getAllCandidates(@Query() query: PaginationQueryDto) {
    return this.candidatesService.getAll(query);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  create(@Body() payload: ShortlistedCandidateDto) {
    return this.candidatesService.create(payload);
  }
}
