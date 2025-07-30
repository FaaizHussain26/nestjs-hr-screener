import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortlistedCandidatesController } from './controller/shortlisted-candidates.controller';
import { DashboardController } from './controller/dashboard.controller';
import {
  ShortlistedCandidates,
  ShortlistedSchema,
} from './entities/shortlisted-candidates.schema';
import { ShortlistedCandidatesRepository } from './repositories/shortlisted-candidates.repository';
import { ShortlistedCandidatesService } from './services/shortlisted-candidates.service';
import { DashboardService } from './services/dashboard.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortlistedCandidates.name, schema: ShortlistedSchema },
    ]),
  ],
  controllers: [ShortlistedCandidatesController, DashboardController],
  providers: [
    ShortlistedCandidatesService,
    ShortlistedCandidatesRepository,
    DashboardService,
    JwtService,
  ],
})
export class ShortlistedCandidatesModule {}
