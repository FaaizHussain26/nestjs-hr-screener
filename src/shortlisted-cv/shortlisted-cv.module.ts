import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortlistedCv, ShortlistedCvSchema } from './entitities/shortlistedCv.schema';
import { ShortlistedCvController } from './controller/shortlisted-cv.controller';
import { ShortlistedCvService } from './services/shortlisted-cv.service';
import { ShortlistedCvRepository } from './repositories/shortlisted-cv.repository';

@Module({
     imports: [
    MongooseModule.forFeature([
      { name: ShortlistedCv.name, schema: ShortlistedCvSchema },
    ]),
  ],
  controllers: [ShortlistedCvController],
  providers: [ShortlistedCvService, ShortlistedCvRepository],
})
export class ShortlistedCvModule {}
