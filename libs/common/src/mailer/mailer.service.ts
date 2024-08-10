import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendMail(
    to: string,
    subject: string,
    context: { [key: string]: string },
  ): Promise<void> {
    const template = this.generateTemplate(context);

    await this.mailerService.sendMail({
      to,
      subject,
      html: template,
      context,
    });
  }

  private generateTemplate(context: { [key: string]: string }): string {
    return `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 8px; }
          .header { text-align: center; background-color: #007bff; color: #fff; padding: 20px; border-radius: 8px 8px 0 0; }
          .body { padding: 20px; text-align: left; color: #333; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Test to Our Service, ${context.name}!</h1>
          </div>
          <div class="body">
            <p>Dear ${context.name},</p>
            <p>${context.text}</p>
            <p>woke</p>
            <p>Best regards,<br>The ${context.company} Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
