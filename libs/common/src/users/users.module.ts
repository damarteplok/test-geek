import { Module } from '@nestjs/common';
import { User } from './models/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseOrmModule } from '../databaseOrm';
import { LoggerModule } from '../logger';
import { RoleModule } from '../role';
import { MinioService } from '../minio';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ORM_HOST: Joi.string().required(),
        ORM_PORT: Joi.number().required(),
        ORM_DATABASE: Joi.string().required(),
        ORM_USERNAME: Joi.string().required(),
        ORM_SYNC: Joi.boolean().required(),
      }),
    }),
    DatabaseOrmModule,
    DatabaseOrmModule.forFeature([User]),
    LoggerModule,
    RoleModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, MinioService],
  exports: [UsersService],
})
export class UsersModule {}
