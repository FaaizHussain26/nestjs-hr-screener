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
  UseGuards,
} from '@nestjs/common';
import { SkillService } from '../services/skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('skills')
@ApiBearerAuth()
@ApiTags('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.skillService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: string) {
    return this.skillService.findById(id);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  create(@Body() payload: CreateSkillDto) {
    return this.skillService.create(payload);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() payload: CreateSkillDto) {
    return this.skillService.update(id, payload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.skillService.delete(id);
  }
}
