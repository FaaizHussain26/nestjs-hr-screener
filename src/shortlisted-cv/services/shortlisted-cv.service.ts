import { Injectable } from '@nestjs/common';
import { ShortlistedCvRepository } from '../repositories/shortlisted-cv.repository';
import { CreateShortlistedCvDto } from '../controller/dtos/create-shortlisted-cv.dto';
import { ShortlistedCv } from '../entitities/shortlistedCv.schema';


@Injectable()
export class ShortlistedCvService {
  constructor(private readonly cvRepository: ShortlistedCvRepository) {}

  async createShortlistedCv(dto: CreateShortlistedCvDto): Promise<ShortlistedCv> {
    return this.cvRepository.create(dto);
  }

  async getAllShortlistedCvs(): Promise<ShortlistedCv[]> {
    return this.cvRepository.findAll();
  }
}