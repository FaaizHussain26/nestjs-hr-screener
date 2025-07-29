import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../entities/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async getAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findAllPaginatedAndFiltered({
    page = 1,
    limit = 10,
    search = '',
    role,
    isActive,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }) {
    const filter: any = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) filter.role = role;
    if (typeof isActive === 'boolean') filter.isActive = isActive;
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(filter),
    ]);
    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async getbyId(id: string): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }
  async getByEmail(userEmail: string): Promise<User | null> {
    return await this.userModel.findOne({ email: userEmail }).exec();
  }
  async updateProfile(id: string, user: Partial<User>): Promise<User | null> {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: user },
      { new: true },
    );
  }

  async update(id: string, update: Partial<User>): Promise<User | null> {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { new: true },
    );
  }

  async delete(id: string): Promise<User | null> {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: { isActive: false, deletedAt: new Date() } },
      { new: true },
    );
  }
}
