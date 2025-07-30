import { Module } from '@nestjs/common';
import { Skill, SkillSchema } from './entities/skill.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillController } from './controller/skill.controller';
import { SkillService } from './services/skill.service';
import { SkillRepository } from './repositories/skill.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SkillController],
  imports: [
    MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }]),
  ],

  providers: [SkillService, SkillRepository, JwtService],
})
export class SkillModule {}
