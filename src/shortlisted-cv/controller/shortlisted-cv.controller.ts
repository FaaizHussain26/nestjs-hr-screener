import { Body, Controller, Get, Post } from '@nestjs/common';
import { ShortlistedCvService } from '../services/shortlisted-cv.service';
import { ShortlistedCv } from '../entitities/shortlistedCv.schema';
import { CreateShortlistedCvDto } from './dtos/create-shortlisted-cv.dto';

@Controller('shortlisted-cvs')
export class ShortlistedCvController {
  constructor(private readonly cvService: ShortlistedCvService) {}

  @Post('/')
  async createCv(@Body() dto: CreateShortlistedCvDto): Promise<ShortlistedCv> {
    return this.cvService.createShortlistedCv(dto);
  }

  @Get('/')
  async getAllCvs(): Promise<ShortlistedCv[]> {
    return this.cvService.getAllShortlistedCvs();
  }
}
