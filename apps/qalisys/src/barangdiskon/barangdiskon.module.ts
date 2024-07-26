import { DatabaseOrmModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { BarangDiskon } from './models/barangdiskon.entity';
import { BarangDiskonController } from './barangdiskon.controller';
import { BarangDiskonService } from './barangdiskon.service';
import { BarangDiskonRepository } from './barangdiskon.repository';
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
    DatabaseOrmModule.forFeature([BarangDiskon]),
    LoggerModule,
  ],
  controllers: [BarangDiskonController],
  providers: [BarangDiskonService, BarangDiskonRepository],
  exports: [BarangDiskonService],
})
export class BarangDiskonModule {}