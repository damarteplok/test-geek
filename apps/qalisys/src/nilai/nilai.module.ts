import { DatabaseOrmModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Nilai } from './models/nilai.entity';
import { NilaiController } from './nilai.controller';
import { NilaiService } from './nilai.service';
import { NilaiRepository } from './nilai.repository';
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
    DatabaseOrmModule.forFeature([Nilai]),
    LoggerModule,
  ],
  controllers: [NilaiController],
  providers: [NilaiService, NilaiRepository],
  exports: [NilaiService],
})
export class NilaiModule {}