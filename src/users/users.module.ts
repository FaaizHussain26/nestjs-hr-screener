import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { User, UserSchema } from './entitities/user.schema';
import { UserRepository } from './repositories/user.repo';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EventEmitterModule.forRoot(),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [MongooseModule],
})
export class UsersModule {}
