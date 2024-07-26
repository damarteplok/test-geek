import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MinioFileUploadOptions } from './minio-file-upload.interface';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;

  constructor(private readonly configService: ConfigService) {
    const endPoint = configService.get<string>('MINIO_ENDPOINT');
    const port = configService.get<number>('MINIO_PORT');
    const useSSL = configService.get<boolean>('MINIO_SSL') ?? false;
    const accessKey = configService.get<string>('MINIO_ACCESS_KEY');
    const secretKey = configService.get<string>('MINIO_SECRET_KEY');

    this.minioClient = new Client({
      endPoint,
      port: +port,
      useSSL: useSSL === true,
      accessKey,
      secretKey,
    });
  }

  async uploadFile({ bucket, file, key }: MinioFileUploadOptions) {
    const exists = await this.minioClient.bucketExists(bucket);
    if (!exists) {
      await this.minioClient.makeBucket(bucket, 'us-east-1');
    }
    return await this.minioClient.putObject(bucket, key, file);
  }

  async getFile(bucketName: string, objectName: string) {
    return await this.minioClient.getObject(bucketName, objectName);
  }

  async removeFile(bucketName: string, objectName: string) {
    return await this.minioClient.removeObject(bucketName, objectName);
  }
}
