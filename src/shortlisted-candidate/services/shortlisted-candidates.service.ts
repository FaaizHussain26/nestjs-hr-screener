import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ShortlistedCandidateDto } from '../controller/dto/create-shortlisted-candidates.dto';
import { ShortlistedCandidatesRepository } from '../repositories/shortlisted-candidates.repository';
import { DeleteQueryDto } from '../controller/dto/delete-shortlisted-candidates.dto';

@Injectable()
export class ShortlistedCandidatesService {
  constructor(
    private readonly candidatesRepository: ShortlistedCandidatesRepository,
  ) {}

  async create(payload: ShortlistedCandidateDto) {
    const existingCandidate = await this.candidatesRepository.getByEmail(
      payload.applicant_email,
    );
    if (existingCandidate) {
      payload.isDuplicated = true;
    }
    return await this.candidatesRepository.create(payload);
  }

  async getAll(query: PaginationQueryDto) {
    await this.candidatesRepository.markDuplicates();
    return await this.candidatesRepository.findAll(query);
  }

  async getById(id: string) {
    return await this.candidatesRepository.getbyId(id);
  }

  async getDashboardStats() {
    return {
      total_candidates: await this.candidatesRepository.count(),
      total_rejected_candidates: await this.candidatesRepository.count(
        'job_matched',
        'No',
        true,
      ),
      total_accepted_candidates: await this.candidatesRepository.count(
        'job_matched',
        'Yes',
        true,
      ),
      total_duplicate_candidates: await this.candidatesRepository.count(
        'isDuplicated',
        'true',
      ),
    };
  }
  async deleteCandidate(payload: DeleteQueryDto) {
    const { id, deleteOption } = payload;
    const candidate = await this.candidatesRepository.getbyId(id);
    if (!candidate) {
      return { success: false, message: `Candidate with id = ${id} not found` };
    }
    if (deleteOption === 'softDelete') {
      candidate.isDeleted = true;
      const candidateSoftDelete = await this.candidatesRepository.update(
        id,
        candidate,
      );
      return {
        success: true,
        message: `Candidate with ID ${id} has been soft deleted successfully`,
      };
    }
    if (deleteOption === 'hardDelete') {
      if (candidate.isDeleted === true) {
        const candidateHardDelete =
          await this.candidatesRepository.deleteCandidate(id);
        return {
          success: true,
          message: `Candidate with ID ${id} has been permanently deleted`,
        };
      } else {
        return {
          success: false,
          message: `Candidate with ID ${id} must be soft deleted before this operation`,
        };
      }
    }
  }
}
