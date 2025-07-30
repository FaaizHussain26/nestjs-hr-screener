import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { DeleteQueryDto } from 'src/shortlisted-candidate/controller/dto/delete-shortlisted-candidates.dto';
import { JobService } from '../services/job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('jobs')
@ApiBearerAuth()
@ApiTags('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }
  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: PaginationQueryDto) {
    return this.jobService.findAll(query);
  }
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(id, updateJobDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/')
  @UseGuards(JwtAuthGuard)
  delete(@Query() payload: DeleteQueryDto) {
    return this.jobService.delete(payload);
  }
  @HttpCode(HttpStatus.OK)
  @Put('restore/:id')
  @UseGuards(JwtAuthGuard)
  restore(@Param('id') id: string) {
    return this.jobService.restore(id);
  }
}
