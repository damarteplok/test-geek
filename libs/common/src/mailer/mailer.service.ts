import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import * as Handlebars from 'handlebars';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendMail(
    to: string,
    subject: string,
    context: { [key: string]: string },
    templateHandlebars: string,
  ): Promise<void> {
    const template = this.generateTemplate(context, templateHandlebars);

    const response = await this.mailerService.sendMail({
      to,
      subject,
      html: template,
      context,
    });
    return response;
  }

  /**
   *
   * contoh penggunaan
   * const template = `
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
            <h1>Welcome to Our Service, {{name}}!</h1>
          </div>
          <div class="body">
            <p>Dear {{name}},</p>
            <p>{{text}}</p>
            {{#if additionalInfo}}
            <p>{{additionalInfo}}</p>
            {{/if}}
            <p>Best regards,<br>The {{company}} Team</p>
          </div>
          <div class="footer">
            <p>{{footerText}}</p>
          </div>
        </div>
      </body>
      </html>
    `;
   */
  private generateTemplate(
    context: { [key: string]: string },
    template: string,
  ): string {
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(context);
  }
}
