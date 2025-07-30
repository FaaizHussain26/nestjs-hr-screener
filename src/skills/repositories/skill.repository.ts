import { InjectModel } from '@nestjs/mongoose';
import { Skill } from '../entities/skill.schema';
import { DeleteResult, Model } from 'mongoose';
import { UpdateSkillDto } from '../controller/dto/update-skill.dto';
import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from '../controller/dto/create-skill.dto';
@Injectable()
export class SkillRepository {
  constructor(
    @InjectModel(Skill.name)
    private readonly skillModel: Model<Skill>,
  ) {}

  async create(payload: CreateSkillDto): Promise<Skill> {
    const create = new this.skillModel(payload);
    return await create.save();
  }

  async findAll(): Promise<Skill[]> {
    return await this.skillModel.find();
  }

  async findById(id: string): Promise<Skill | null> {
    return await this.skillModel.findById(id).exec();
  }
  async findByName(name: string): Promise<Skill | null> {
    return await this.skillModel.findOne({ technical_skill: name }).exec();
  }

  async update(
    id: string,
    updateSkillDto: UpdateSkillDto,
  ): Promise<Skill | null> {
    return await this.skillModel
      .findByIdAndUpdate(id, updateSkillDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<DeleteResult> {
    const res = await this.skillModel.deleteOne({ _id: id }).exec();
    return res;
  }
}
