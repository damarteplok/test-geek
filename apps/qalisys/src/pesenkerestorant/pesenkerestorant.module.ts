import { Camunda8Service, DatabaseOrmModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { PesenKeRestorant } from './models/pesenkerestorant.entity';
import { PesenKeRestorantController } from './pesenkerestorant.controller';
import { PesenKeRestorantService } from './pesenkerestorant.service';
import { PesenKeRestorantRepository } from './pesenkerestorant.repository';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

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
    DatabaseOrmModule.forFeature([PesenKeRestorant]),
    LoggerModule,
  ],
  controllers: [PesenKeRestorantController],
  providers: [
    PesenKeRestorantService, 
    PesenKeRestorantRepository,
    Camunda8Service,
  ],
  exports: [PesenKeRestorantService],
})
export class PesenKeRestorantModule {}