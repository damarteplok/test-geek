import { Camunda8Service, DatabaseOrmModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { DecideDinner } from './models/decidedinner.entity';
import { DecideDinnerController } from './decidedinner.controller';
import { DecideDinnerService } from './decidedinner.service';
import { DecideDinnerRepository } from './decidedinner.repository';
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
    DatabaseOrmModule.forFeature([DecideDinner]),
    LoggerModule,
  ],
  controllers: [DecideDinnerController],
  providers: [
    DecideDinnerService, 
    DecideDinnerRepository,
    Camunda8Service,
  ],
  exports: [DecideDinnerService],
})
export class DecideDinnerModule {}