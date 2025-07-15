import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/pagination and filter/dtos/pagination-query.dto';
import { ShortlistedCandidateDto } from '../controller/dtos/create-shortlisted-candidates.dto';
import { ShortlistedCandidatesRepository } from '../repositories/shortlisted-candidates.repository';

@Injectable()
export class ShortlistedCandidatesService {
  constructor(private readonly candidatesRepository: ShortlistedCandidatesRepository) {}

  async create(payload: ShortlistedCandidateDto) {
    return this.candidatesRepository.create(payload);
  }

  async getAll(query: PaginationQueryDto) {
    return this.candidatesRepository.findAll(query);
  }
}
