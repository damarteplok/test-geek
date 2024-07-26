import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Camunda8Module, LoggerModule } from '@app/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ChooseDinnerModule } from './choosedinner/choosedinner.module';
import { ConfigModule } from '@nestjs/config';
import { NamaNimModule } from './namanim/namanim.module';
import { BarangDiskonModule } from './barangdiskon/barangdiskon.module';
import { NilaiModule } from './nilai/nilai.module';

@Module({
  imports: [
    LoggerModule,
    UsersModule,
    NamaNimModule,
    BarangDiskonModule,
    NilaiModule,
    AuthModule,
    Camunda8Module,
    ChooseDinnerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
      port: 8011,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
