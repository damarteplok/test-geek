import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AuthModule,
  UsersModule as BaseUsersModule,
  Camunda8Module,
  LoggerModule,
  PermissionModule,
  RoleModule,
} from '@app/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PesenKeRestorantModule } from './pesenkerestorant/pesenkerestorant.module';
import { DecideDinnerModule } from './decidedinner/decidedinner.module';
import { MintaBilingModule } from './mintabiling/mintabiling.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    BaseUsersModule,
    PermissionModule,
    RoleModule,
    Camunda8Module,
    PesenKeRestorantModule,
    DecideDinnerModule,
    MintaBilingModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: +process.env.APP_THROTTLER_TTL,
        limit: +process.env.APP_THROTTLER_LIMIT,
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
