import { CreateSkillDto } from '../controller/dto/create-skill.dto';
import { UpdateSkillDto } from '../controller/dto/update-skill.dto';
import { SkillRepository } from '../repositories/skill.repository';

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
    return this.skillRepository.findById(id);
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    return this.skillRepository.update(id, updateSkillDto);
  }

  async delete(id: string){
    const res = await this.skillRepository.delete(id);
    return res;
  }
}
