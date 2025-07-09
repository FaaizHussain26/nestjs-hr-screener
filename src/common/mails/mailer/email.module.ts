import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";



@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp-relay.brevo.com",
        port: 465,
        secure: true,
        auth: {
          user: "8d89e6001@smtp-brevo.com",
          pass: "xsmtpsib-a4ff5b9cab13d9c9bf66ce998cc433ee455d7559ba4fbba6cc868b4bce259b2c-sYrmLFbJzBvUMkdS",
        },
      },
      defaults: {
        from: '"shaheer" <shaheer.99.ahmed@gmail.com  >',
      },
    }),
  ],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class AppMailerModule {}
