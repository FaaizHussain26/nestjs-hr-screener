import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { ShortlistedCandidateDto } from '../controller/dto/create-shortlisted-candidates.dto';
import { ShortlistedCandidates } from '../entitities/shortlisted-candidates.schema';
import { PaginateAndFilter } from 'src/common/pagination/paginate-and-filter';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Injectable()
export class ShortlistedCandidatesRepository {
  constructor(
    @InjectModel(ShortlistedCandidates.name)
    private readonly candidateModel: Model<ShortlistedCandidates>,
  ) {}

  async create(
    payload: ShortlistedCandidateDto,
  ): Promise<ShortlistedCandidates> {
    const create = new this.candidateModel(payload);
    return await create.save();
  }

  async findAll(query: PaginationQueryDto): Promise<ShortlistedCandidates[]> {
    const result = await PaginateAndFilter<ShortlistedCandidates>(
      this.candidateModel,
      query,
      ['applicant_name'],
    );
    return result.data;
  }
  async getByEmail(email: string): Promise<ShortlistedCandidates | null> {
    return await this.candidateModel.findOne({ applicant_email: email }).exec();
  }
  async getbyId(id: string): Promise<ShortlistedCandidates | null> {
    return await this.candidateModel.findById(id).exec();
  }

  async count(fieldName?: string, fieldValue?: string ,useRegex:boolean=false) {
    const filter =  fieldName && fieldValue
      ? {
          [fieldName]: useRegex ? new RegExp(`^${fieldValue}$`, 'i') : fieldValue,
        }
      : {};
    return await this.candidateModel
      .countDocuments(filter)
      .exec();
  }
  async update(
    id: string,
    candidate: Partial<ShortlistedCandidates>,
  ): Promise<ShortlistedCandidates | null> {
    return await this.candidateModel.findOneAndUpdate(
      { _id: id },
      { $set: candidate },
      { new: true },
    );
  }
  async deleteCandidate(id: string): Promise<DeleteResult> {
    return await this.candidateModel.deleteOne({ _id: id });
  }
}
