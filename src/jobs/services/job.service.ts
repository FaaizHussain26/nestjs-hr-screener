import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { DeleteQueryDto } from 'src/shortlisted-candidate/controller/dto/delete-shortlisted-candidates.dto';
import { CreateJobDto } from '../controller/dto/create-job.dto';
import { UpdateJobDto } from '../controller/dto/update-job.dto';
import { JobRepository } from '../repositories/job.repository';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

interface VectorSearchResult {
  job: any;
  score: number;
}

interface VectorSearchOptions {
  limit?: number;
  filter?: any;
  minScore?: number;
}

@Injectable()
export class JobService {
  private openAIClient: OpenAI
  constructor(private readonly configService: ConfigService, private readonly jobRepository: JobRepository) {
    this.openAIClient = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async create(createJobDto: CreateJobDto) {
    const createdJob = await this.jobRepository.create(createJobDto);

    await this.generateAndStoreVectors(createdJob._id as string, createJobDto);

    return createdJob;
  }

  async findAll(query: PaginationQueryDto) {
    return await this.jobRepository.findAll(query);
  }

  async findOne(id: string) {
    const job = await this.jobRepository.findById(id);
    if (!job) {
      return { success: false, message: 'Job not found' };
    }
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const job = await this.jobRepository.update(id, updateJobDto);
    if (!job) {
      return { success: false, message: 'Job not found' };
    }

    // Regenerate vectors if content fields were updated
    if (updateJobDto.title || updateJobDto.description || updateJobDto.skills) {
      await this.generateAndStoreVectors(id, updateJobDto);
    }

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

  // Vector-specific methods

  /**
   * Generate embeddings for job content and store them
   */
  async generateAndStoreVectors(jobId: string, jobData: Partial<CreateJobDto | UpdateJobDto>) {
    try {
      const vectors: any = {};

      if (jobData.title) {
        vectors.titleVector = await this.generateEmbedding(jobData.title);
      }

      if (jobData.description) {
        vectors.descriptionVector = await this.generateEmbedding(jobData.description);
      }

      if (jobData.skills && jobData.skills.length > 0) {
        vectors.skillsVector = await this.generateEmbedding(jobData.skills.join(' '));
      }

      const combinedText = [
        jobData.title,
        jobData.description,
        jobData.skills?.join(' ')
      ].filter(Boolean).join(' ');

      if (combinedText) {
        vectors.combinedVector = await this.generateEmbedding(combinedText);
      }

      vectors.vectorMetadata = {
        model: 'text-embedding-3-small',
        lastUpdated: new Date(),
        dimensions: vectors.combinedVector?.length || 1536
      };

      await this.jobRepository.update(jobId, vectors);
    } catch (error) {
      console.error('Error generating vectors:', error);
    }
  }

  /**
   * Generate embedding using OpenAI text-embedding-3-small
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openAIClient.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.replace(/\n/g, ' '),
        encoding_format: 'float'
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  /**
   * Perform vector similarity search using MongoDB Atlas Vector Search
   */
  async vectorSearch(
    queryVector: number[],
    options: VectorSearchOptions = {}
  ): Promise<VectorSearchResult[]> {
    const {
      limit = 10,
      filter = { isActive: true, isDeleted: false },
      minScore = 0.7
    } = options;

    try {
      const pipeline = [
        {
          $vectorSearch: {
            index: 'job_vector_index', // Name of your vector search index
            path: 'combinedVector',
            queryVector: queryVector,
            numCandidates: limit * 3, // Search more candidates for better results
            limit: limit,
            filter: filter
          }
        },
        {
          $addFields: {
            score: { $meta: 'vectorSearchScore' }
          }
        },
        {
          $match: {
            score: { $gte: minScore }
          }
        }
      ];

      const results = await this.jobRepository.aggregate(pipeline);

      return results.map(result => ({
        job: result,
        score: result.score
      }));
    } catch (error) {
      console.error('Vector search error:', error);
      return [];
    }
  }

  /**
   * Search jobs by text query using vector similarity
   */
  async searchJobsByText(
    query: string,
    options: VectorSearchOptions = {}
  ): Promise<VectorSearchResult[]> {
    try {
      const queryVector = await this.generateEmbedding(query);
      return await this.vectorSearch(queryVector, options);
    } catch (error) {
      console.error('Text search error:', error);
      return [];
    }
  }

  /**
   * Find similar jobs to a given job
   */
  async findSimilarJobs(
    jobId: string,
    options: VectorSearchOptions = {}
  ): Promise<VectorSearchResult[]> {
    try {
      const job = await this.jobRepository.findById(jobId);
      if (!job || !job.combinedVector) {
        return [];
      }

      // Exclude the source job from results
      const filter = {
        ...options.filter,
        _id: { $ne: job._id }
      };

      return await this.vectorSearch(job.combinedVector, {
        ...options,
        filter
      });
    } catch (error) {
      console.error('Similar jobs search error:', error);
      return [];
    }
  }

  /**
   * Batch update vectors for existing jobs
   */
  async updateAllVectors() {
    try {
      const jobs = await this.jobRepository.findAll({});

      for (const job of jobs.data || []) {
        await this.generateAndStoreVectors(job._id as string, {
          title: job.title,
          description: job.description,
          skills: job.skills
        });
      }

      return {
        success: true,
        message: `Updated vectors for ${jobs.data?.length || 0} jobs`
      };
    } catch (error) {
      console.error('Batch vector update error:', error);
      return {
        success: false,
        message: 'Failed to update vectors'
      };
    }
  }
}