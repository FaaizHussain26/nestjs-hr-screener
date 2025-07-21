import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobController } from './controller/job.controller';
import { Job, JobSchema } from './entitities/job.schema';
import { JobService } from './services/job.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
  controllers: [JobController],
  providers: [JobService],
})
export class JobsModule {}
