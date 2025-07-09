import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entitities/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
    async getByEmail(userEmail: string): Promise<User | null> {
      return this.userModel.findOne({ email: userEmail }).exec();
    }
}
