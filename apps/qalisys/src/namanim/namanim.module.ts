import { DatabaseOrmModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { NamaNim } from './models/namanim.entity';
import { NamaNimController } from './namanim.controller';
import { NamaNimService } from './namanim.service';
import { NamaNimRepository } from './namanim.repository';
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
    DatabaseOrmModule.forFeature([NamaNim]),
    LoggerModule,
  ],
  controllers: [NamaNimController],
  providers: [NamaNimService, NamaNimRepository],
  exports: [NamaNimService],
})
export class NamaNimModule {}