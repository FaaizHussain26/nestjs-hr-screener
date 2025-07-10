import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortlistedCv } from '../entitities/shortlistedCv.schema';
import { CreateShortlistedCvDto } from '../controller/dtos/create-shortlisted-cv.dto';

@Injectable()
export class ShortlistedCvRepository {
  constructor(
    @InjectModel(ShortlistedCv.name)
    private readonly cvModel: Model<ShortlistedCv>,
  ) {}

  async create(dto: CreateShortlistedCvDto): Promise<ShortlistedCv> {
    const newCv = new this.cvModel(dto);
    return newCv.save();
  }

  async findAll(): Promise<ShortlistedCv[]> {
    return this.cvModel.find().sort({ createdAt: -1 }).exec();
  }
}
