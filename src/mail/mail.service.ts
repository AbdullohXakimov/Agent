import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Client } from '../clients/entities/client.entity';
import { Order } from '../orders/entities/order.entity';



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
  async sendMailtoUserToConfirm(order: Order) {
    console.log(order);

    const url = `${process.env.API_HOST}:${process.env.PORT}/orders/confirm/${order.activation_link}`;
    console.log(url);
    await this.mailerService.sendMail({
      to: order.client.email,
      subject: `Confirm that You take the products you ordered on ${order.createdAt}`,
      template: './confirmation2',
      context: {
        name: order.client.name,
        url,
      },
    });
  }
}
