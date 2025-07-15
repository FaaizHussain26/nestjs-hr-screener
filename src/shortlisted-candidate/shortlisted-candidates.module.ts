import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortlistedCandidatesController } from './controller/shortlisted-candidates.controller';
import {
  ShortlistedCandidates,
  ShortlistedSchema,
} from './entitities/shortlisted-candidates.schema';
import { ShortlistedCandidatesRepository } from './repositories/shortlisted-candidates.repository';
import { ShortlistedCandidatesService } from './services/shortlisted-candidates.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortlistedCandidates.name, schema: ShortlistedSchema },
    ]),
  ],
  controllers: [ShortlistedCandidatesController],
  providers: [ShortlistedCandidatesService, ShortlistedCandidatesRepository],
})
export class ShortlistedCandidatesModule {}
