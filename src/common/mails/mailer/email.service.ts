import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

interface Email {
  subject: string;
  toEmail: string;
  data: string;
}
@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendDynamicEmail(email: Email) {
    try {
      if (!email.toEmail) {
        throw new Error('No recipient email provided');
      }

      await this.mailerService.sendMail({
        to: email.toEmail,
        subject: email.subject,
        html: email.data,
      });
      console.log('Email sent successfully');
    } catch (err) {
      console.error('Error sending email:', err);
    }
  }

  // @OnEvent('user.registered')
  // async handleUserRegisteredEvent(record: any) {
  //   console.log(record);
  //   await this.sendDynamicEmail({
  //     subject: "New member's Registered",
  //     toEmail: record.email,
  //     data: `<b>Welcome ${record.email}<b> <br/> <p>You have been registered Successfully</p>`,
  //   });
  // }

  @OnEvent('forgot.password')
  async handleForgotPasswordEvent(record: any) {
    console.log(record);
    await this.sendDynamicEmail({
      subject: 'Otp : Forgot Password',
      toEmail: record.email,
      data: `<b>Dear ${record.email}</b> <br/> <p>Your Reset password link is <b>${record.link}</b> you can now reset your password</p>`,
    });
  }
}
