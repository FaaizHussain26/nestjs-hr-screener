import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AppMailerModule } from './common/mails/mailer/email.module';
import { LoggerModule } from 'nestjs-pino';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortlistedCvModule } from './shortlisted-cv/shortlisted-cv.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },

        level: 'info',

        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
            };
          },
        },

        customLogLevel: function (req, res, err) {
          if (res.statusCode >= 500 || err) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },

        customSuccessMessage: function (req, res) {
          return `${req.method} ${req.url} → ${res.statusCode}`;
        },
      },
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        if (!uri) {
          throw new Error('MONGO_URI is not defined in .env');
        }
        return {
          uri,
          dbName: 'Agents',
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
