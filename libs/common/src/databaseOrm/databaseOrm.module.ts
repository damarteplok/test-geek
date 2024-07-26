import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('ORM_HOST'),
        port: configService.getOrThrow('ORM_PORT'),
        database: configService.getOrThrow('ORM_DATABASE'),
        username: configService.getOrThrow('ORM_USERNAME'),
        password: configService.getOrThrow('ORM_PASSWORD'),
        synchronize: configService.getOrThrow('ORM_SYNC'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseOrmModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);
  }
}
