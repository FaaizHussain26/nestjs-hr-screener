import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from '../entities/job.schema';
import { CreateJobDto } from '../controller/dto/create-job.dto';
import { UpdateJobDto } from '../controller/dto/update-job.dto';
import { PaginateAndFilter, PaginationOutput } from 'src/common/pagination/paginate-and-filter';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Injectable()
export class JobRepository {
  constructor(@InjectModel(Job.name) private readonly jobModel: Model<Job>) { }

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const createdJob = new this.jobModel(createJobDto);
    return createdJob.save();
  }

  async findAll(query: PaginationQueryDto): Promise<PaginationOutput<Job>> {
    const result = await PaginateAndFilter<Job>(
      this.jobModel,
      query,
      ['title'],
    );
    return result;
  }

  async findById(id: string): Promise<Job | null> {
    return this.jobModel.findById(id).exec();
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job | null> {
    return this.jobModel
      .findByIdAndUpdate(id, updateJobDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const res = await this.jobModel.deleteOne({ _id: id }).exec();
    return { deleted: res.deletedCount > 0 };
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return this.jobModel.aggregate(pipeline).exec();
  }
}