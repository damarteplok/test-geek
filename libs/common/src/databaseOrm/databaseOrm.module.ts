import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.getOrThrow('ORM_HOST'),
          port: configService.getOrThrow('ORM_PORT'),
          database: configService.getOrThrow('ORM_DATABASE'),
          username: configService.getOrThrow('ORM_USERNAME'),
          password: configService.getOrThrow('ORM_PASSWORD'),
          synchronize: configService.get<boolean>('ORM_SYNC'),
          autoLoadEntities: true,
          // migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
          // seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
          // factories: [__dirname + '/factories/**/*{.ts,.js}'],
          // cli: {
          //   migrationsDir: __dirname + '/migrations/',
          // },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseOrmModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);
  }
}
