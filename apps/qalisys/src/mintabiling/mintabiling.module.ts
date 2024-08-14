import { Camunda8Service, DatabaseOrmModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { MintaBiling } from './models/mintabiling.entity';
import { MintaBilingController } from './mintabiling.controller';
import { MintaBilingService } from './mintabiling.service';
import { MintaBilingRepository } from './mintabiling.repository';
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
    DatabaseOrmModule.forFeature([MintaBiling]),
    LoggerModule,
  ],
  controllers: [MintaBilingController],
  providers: [
    MintaBilingService, 
    MintaBilingRepository,
    Camunda8Service,
  ],
  exports: [MintaBilingService],
})
export class MintaBilingModule {}