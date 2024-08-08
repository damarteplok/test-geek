import { DatabaseOrmModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { DecideForDinner } from './models/decidefordinner.entity';
import { DecideForDinnerController } from './decidefordinner.controller';
import { DecideForDinnerService } from './decidefordinner.service';
import { DecideForDinnerRepository } from './decidefordinner.repository';
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
    DatabaseOrmModule.forFeature([DecideForDinner]),
    LoggerModule,
  ],
  controllers: [DecideForDinnerController],
  providers: [DecideForDinnerService, DecideForDinnerRepository],
  exports: [DecideForDinnerService],
})
export class DecideForDinnerModule {}