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
