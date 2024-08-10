import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  private readonly botToken: string;
  private readonly chatId: string;
  private readonly topicId: string;

  constructor(private readonly configService: ConfigService) {
    this.botToken = configService.get<string>('TELEGRAM_TOKEN');
    this.chatId = configService.get<string>('TELEGRAM_CHAT_ID');
    this.topicId = configService.get<string>('TELEGRAM_TOPIC_ID');
  }

  async sendMessage(message: string): Promise<Response> {
    const url = `${this.configService.get<string>('TELEGRAM_BASE_URL')}${this.botToken}/sendMessage`;
    const body = {
      chat_id: this.chatId,
      message_thread_id: this.topicId,
      text: message,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response;
  }
}
