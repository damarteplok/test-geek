import { Module } from '@nestjs/common';
import { Camunda8Service } from './camunda8.service';
import { Camunda8Controller } from './camunda8.controller';
import { MinioModule } from '../minio/minio.module';
import { BpmnParserService, CodeGeneratorService } from '../bpmn';
import { MinioService } from '../minio';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MailerService, MailModule } from '../mailer';

@Module({
  imports: [
    MinioModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MINIO_SSL: Joi.boolean(),
        MINIO_PORT: Joi.number().required(),
        CAMUNDA_SECURE_CONNECTION: Joi.boolean(),
        ROOTDIR: Joi.string().required(),
        ZEEBE_GRPC_ADDRESS: Joi.string().required(),
        ZEEBE_REST_ADDRESS: Joi.string().required(),
        ZEEBE_CLIENT_ID: Joi.string().required(),
        ZEEBE_CLIENT_SECRET: Joi.string().required(),
        CAMUNDA_AUTH_STRATEGY: Joi.string().required(),
        CAMUNDA_OAUTH_URL: Joi.string().required(),
        CAMUNDA_TASKLIST_BASE_URL: Joi.string().required(),
        CAMUNDA_OPERATE_BASE_URL: Joi.string().required(),
        CAMUNDA_OPTIMIZE_BASE_URL: Joi.string().required(),
        CAMUNDA_MODELER_BASE_URL: Joi.string().required(),
        TELEGRAM_TOKEN: Joi.string(),
        TELEGRAM_CHAT_ID: Joi.string(),
        TELEGRAM_TOPIC_ID: Joi.string(),
      }),
    }),
  ],
  providers: [
    Camunda8Service,
    BpmnParserService,
    CodeGeneratorService,
    MinioService,
    MailerService,
  ],
  controllers: [Camunda8Controller],
  exports: [
    Camunda8Service,
    MinioService,
    BpmnParserService,
    CodeGeneratorService,
  ],
})
export class Camunda8Module {}
