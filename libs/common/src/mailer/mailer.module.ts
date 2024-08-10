import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from '../logger';

@Module({
  imports: [
    LoggerModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('MAILER_HOST'),
            port: configService.get<number>('MAILER_PORT'),
            auth: {
              user: configService.get<string>('MAILER_USER'),
              pass: configService.get<string>('MAILER_PASS'),
            },
          },
          defaults: {
            from: configService.get<string>('MAILER_FROM'),
          },
        };
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailModule {}
