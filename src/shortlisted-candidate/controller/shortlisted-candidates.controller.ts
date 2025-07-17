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
  UseGuards,
} from '@nestjs/common';

import { ShortlistedCandidateDto } from './dto/create-shortlisted-candidates.dto';
import { ShortlistedCandidatesService } from '../services/shortlisted-candidates.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { DeleteQueryDto } from './dto/delete-shortlisted-candidates.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('shortlisted-candidates')
@ApiBearerAuth()
@ApiTags('Shortlisted Candidates')
export class ShortlistedCandidatesController {
  constructor(
    private readonly candidatesService: ShortlistedCandidatesService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Get('/')
  @UseGuards(JwtAuthGuard)
  getAllCandidates(@Query() query: PaginationQueryDto) {
    return this.candidatesService.getAll(query);
  }
  @HttpCode(HttpStatus.OK)
  @Get('/dashboard/stats/')
  @UseGuards(JwtAuthGuard)
  getDashboardStats() {
    return this.candidatesService.getDashboardStats();
  }
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getById(@Param('id') id: string) {
    return this.candidatesService.getById(id);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  @UseGuards(JwtAuthGuard)
  create(@Body() payload: ShortlistedCandidateDto) {
    return this.candidatesService.create(payload);
  }
  @HttpCode(HttpStatus.OK)
  @Delete('/')
  @UseGuards(JwtAuthGuard)
  deleteCandidate(@Query() payload: DeleteQueryDto) {
    return this.candidatesService.deleteCandidate(payload);
  }
}
