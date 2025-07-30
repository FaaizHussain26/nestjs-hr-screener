import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { DeleteQueryDto } from 'src/shortlisted-candidate/controller/dto/delete-shortlisted-candidates.dto';
import { CreateJobDto } from '../controller/dto/create-job.dto';
import { UpdateJobDto } from '../controller/dto/update-job.dto';
import { JobRepository } from '../repositories/job.repository';

@Injectable()
export class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  async create(createJobDto: CreateJobDto) {
    const createdJob = await this.jobRepository.create(createJobDto);
    return createdJob;
  }

  async findAll(query: PaginationQueryDto) {
    return await this.jobRepository.findAll(query);
  }

  async findOne(id: string) {
    const job = await this.jobRepository.findById(id);
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const job = await this.jobRepository.update(id, updateJobDto);
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }
  async delete(payload: DeleteQueryDto) {
    const { id, deleteOption } = payload;
    const job = await this.jobRepository.findById(id);
    if (!job) {
      return { success: false, message: `Job with id = ${id} not found` };
    }
    if (deleteOption === 'softDelete') {
      job.isDeleted = true;
      const softDelete = await this.jobRepository.update(id, job);
      return {
        success: true,
        message: `Job with ID ${id} has been soft deleted successfully`,
      };
    }
    if (deleteOption === 'hardDelete') {
      if (job.isDeleted === true) {
        const hardDelete = await this.jobRepository.delete(id);
        return {
          success: true,
          message: `Job with ID ${id} has been permanently deleted`,
        };
      } else {
        return {
          success: false,
          message: `Job with ID ${id} must be soft deleted before this operation`,
        };
      }
    }
  }

  async restore(id: string) {
    const job = await this.jobRepository.findById(id);
    if (!job) {
      return { success: false, message: `Job with id = ${id} not found` };
    }
    if (job.isDeleted === true) {
      job.isDeleted = false;
      const candidateSoftDelete = await this.jobRepository.update(id, job);
      return {
        success: true,
        message: `Job with ID ${id} has been successfully restored`,
      };
    } else {
      return {
        success: false,
        message: `Job with ID ${id} has not been deleted`,
      };
    }
  }
}
