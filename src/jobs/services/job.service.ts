import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from '../entitities/job.schema';
import { CreateJobDto } from '../controller/dto/create-job.dto';
import { UpdateJobDto } from '../controller/dto/update-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const createdJob = new this.jobModel(createJobDto);
    return createdJob.save();
  }

  async findAll(): Promise<Job[]> {
    return this.jobModel.find().exec();
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.jobModel.findByIdAndUpdate(id, updateJobDto, { new: true }).exec();
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.jobModel.deleteOne({ _id: id }).exec();
    return { deleted: res.deletedCount > 0 };
  }
}
