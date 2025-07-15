import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AppMailerModule } from './common/mails/mailer/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortlistedCvModule } from './shortlisted-cv/shortlisted-cv.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        if (!uri) {
          throw new Error('MONGO_URI is not defined in .env');
        }
        Logger.log('MongoDB connected',uri);
        return {
          uri,
          dbName: configService.get<string>('MONGO_DB_NAME'),
        };
      },
    }),

    UsersModule,
    AppMailerModule,
    ShortlistedCvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
