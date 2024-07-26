import { DatabaseOrmModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ChooseDinner } from './models/choosedinner.entity';
import { ChooseDinnerController } from './choosedinner.controller';
import { ChooseDinnerService } from './choosedinner.service';
import { ChooseDinnerRepository } from './choosedinner.repository';
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
    DatabaseOrmModule.forFeature([ChooseDinner]),
    LoggerModule,
  ],
  controllers: [ChooseDinnerController],
  providers: [ChooseDinnerService, ChooseDinnerRepository],
  exports: [ChooseDinnerService],
})
export class ChooseDinnerModule {}