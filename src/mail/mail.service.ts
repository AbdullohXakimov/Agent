import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Client } from '../clients/entities/client.entity';



@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendMailtoUser(user: Client) {
    console.log(user);
    
    const url = `${process.env.API_HOST}:${process.env.PORT}/clients/activate/${user.activation_link}`;
    console.log(url);
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Library! Confirmation your email',
      template: './confirmation',
      context: {
        name: user.name,
        url,
      },
    });
  }
}
