import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { ShortlistedCandidateDto } from './dtos/create-shortlisted-candidates.dto';
import { ShortlistedCandidatesService } from '../services/shortlisted-candidates.service';
import { PaginationQueryDto } from 'src/common/pagination and filter/dtos/pagination-query.dto';
import { DeleteQueryDto } from './dtos/delete-shortlisted-candidates.dto';

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
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.candidatesService.getById(id);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  create(@Body() payload: ShortlistedCandidateDto) {
    return this.candidatesService.create(payload);
  }
  @HttpCode(HttpStatus.OK)
  @Delete('/')
  deleteCandidate(@Query() payload: DeleteQueryDto) {
    return this.candidatesService.deleteCandidate(payload);
  }
}
