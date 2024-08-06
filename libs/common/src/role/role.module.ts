import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseOrmModule } from '../databaseOrm';
import { LoggerModule } from '../logger';
import { RoleEntity } from './models/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { PermissionModule } from '../permission';

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
    DatabaseOrmModule.forFeature([RoleEntity]),
    LoggerModule,
    PermissionModule,
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService, RoleRepository],
})
export class RoleModule {}
