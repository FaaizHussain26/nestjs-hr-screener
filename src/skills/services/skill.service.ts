import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from '../controller/dto/create-skill.dto';
import { UpdateSkillDto } from '../controller/dto/update-skill.dto';
import { SkillRepository } from '../repositories/skill.repository';

@Injectable()
export class SkillService {
  constructor(private readonly skillRepository: SkillRepository) {}

  async create(payload: CreateSkillDto) {
    const duplicate = await this.skillRepository.findByName(
      payload.technical_skill,
    );
    if (duplicate) {
      return { success: false, message: 'Skill already exist' };
    }
    return await this.skillRepository.create(payload);
  }

  async findAll() {
    return await this.skillRepository.findAll();
  }

  async findById(id: string) {
    const skill = await this.skillRepository.findById(id);
    if (!skill) {
      return { success: false, message: 'Skill not found' };
    }
    return skill;
  }

  async update(id: string, payload: UpdateSkillDto) {
    const duplicate = await this.skillRepository.findByName(
      payload.technical_skill as string,
    );

    if (duplicate) {
      return { success: false, message: 'Skill already exist' };
    }

    const updatedSkill = await this.skillRepository.update(id, payload);
    if (!updatedSkill) {
      return { success: false, message: 'Skill not found' };
    }
    return updatedSkill;
  }

  async delete(id: string) {
    const res = await this.skillRepository.delete(id);
    if (res.deletedCount === 0) {
      return { success: false, message: 'Skill not found' };
    }
    return {
      success: true,
      message: `Skill with ID ${id} has been permanently deleted`,
    };
  }
}
