import { Module } from '@nestjs/common';
import { ResumeAnalyzerController } from './controller/resume-analyzer.controller';
import { ResumeAnalyzerService } from './service/resume-analyzer.service';
import { ConfigService } from '@nestjs/config';
import { JobRepository } from 'src/jobs/repositories/job.repository';
import { JobsModule } from 'src/jobs/jobs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from 'src/jobs/entities/job.schema';

@Module({
    imports:[MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
    controllers:[ResumeAnalyzerController],
    providers:[ResumeAnalyzerService,ConfigService,JobRepository]
})
export class ResumeAnalyzerModule {}
