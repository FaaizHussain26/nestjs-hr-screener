import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
// import { OtpModule } from 'src/otp/otp.module';
import { User, UserSchema } from './entitities/user.schema';
import { UserRepository } from './repositories/user.repo';

@Module({
  imports: [
    // forwardRef(() => OtpModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService, UserRepository],
  exports: [MongooseModule],
})
export class UsersModule {}
