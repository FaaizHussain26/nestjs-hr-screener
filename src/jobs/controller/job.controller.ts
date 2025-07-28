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
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobService } from '../services/job.service';
import { DeleteQueryDto } from 'src/shortlisted-candidate/controller/dto/delete-shortlisted-candidates.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @HttpCode(HttpStatus.OK)
  @Get('skill/')
  getSkills() {
    return this.jobService.getSkills();
  }
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.jobService.findAll();
  }
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(id, updateJobDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/')
  // @UseGuards(JwtAuthGuard)
  delete(@Query() payload: DeleteQueryDto) {
    return this.jobService.delete(payload);
  }
  @HttpCode(HttpStatus.OK)
  @Put('restore/:id')
  // @UseGuards(JwtAuthGuard)
  restore(@Param('id') id: string) {
    return this.jobService.restore(id);
  }
}
