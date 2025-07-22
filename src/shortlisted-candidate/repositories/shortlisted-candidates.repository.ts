import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { ShortlistedCandidateDto } from '../controller/dto/create-shortlisted-candidates.dto';
import { ShortlistedCandidates } from '../entitities/shortlisted-candidates.schema';
import {
  PaginateAndFilter,
  PaginationOutput,
} from 'src/common/pagination/paginate-and-filter';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Injectable()
export class ShortlistedCandidatesRepository {
  constructor(
    @InjectModel(ShortlistedCandidates.name)
    private readonly candidateModel: Model<ShortlistedCandidates>,
  ) {}


    async markDuplicates() {
    const duplicates = await this.candidateModel.aggregate([
      {
        $group: {
          _id: '$applicant_email',
          count: { $sum: 1 },
          ids: { $push: '$_id' },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);

    for (const dup of duplicates) {
      const [keepId, ...duplicateIds] = dup.ids;


      await this.candidateModel.updateMany(
        { _id: { $in: duplicateIds } },
        { $set: { isDuplicated: true } },
      );

      await this.candidateModel.updateOne(
        { _id: keepId },
        { $set: { isDuplicated: false } },
      );
    }

    return { message: 'Duplicate emails marked as deleted.' };
  }
  async create(
    payload: ShortlistedCandidateDto,
  ): Promise<ShortlistedCandidates> {
    const create = new this.candidateModel(payload);
    return await create.save();
  }

  async find() {
    return await this.candidateModel.find().exec();
  }

  /**
   * Finds candidates with filter, sort, and limit, returns lean array.
   */
  async findSortedLimited(
    filter: Record<string, any> = {},
    sort: Record<string, any> = {},
    limit: number = 0
  ) {
    return await this.candidateModel.find(filter).sort(sort).limit(limit).lean().exec();
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginationOutput<ShortlistedCandidates>> {
    const result = await PaginateAndFilter<ShortlistedCandidates>(
      this.candidateModel,
      query,
      ['applicant_name'],
    );
    return result;
  }
  async getByEmail(email: string): Promise<ShortlistedCandidates | null> {
    return await this.candidateModel.findOne({ applicant_email: email }).exec();
  }
  async getbyId(id: string): Promise<ShortlistedCandidates | null> {
    return await this.candidateModel.findById(id).exec();
  }

  async count(
    fieldName?: string,
    fieldValue?: string,
    useRegex: boolean = false,
  ) {
    const filter =
      fieldName && fieldValue
        ? {
            [fieldName]: useRegex
              ? new RegExp(`^${fieldValue}$`, 'i')
              : fieldValue,
          }
        : {};
    return await this.candidateModel.countDocuments(filter).exec();
  }

  /**
   * Counts documents using a filter object (MongoDB style)
   */
  async countByFilter(filter: Record<string, any>) {
    return await this.candidateModel.countDocuments(filter).exec();
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
