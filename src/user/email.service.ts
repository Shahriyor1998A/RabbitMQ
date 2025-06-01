import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password', 
    },
  });

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/auth/confirm?token=${token}`;

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Email Tasdiqlash',
      html: `<h1>Emailni tasdiqlash</h1><p>Bosing: <a href="${url}">${url}</a></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
