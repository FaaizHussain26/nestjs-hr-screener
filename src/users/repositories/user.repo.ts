import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../entitities/user.schema';

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
}
