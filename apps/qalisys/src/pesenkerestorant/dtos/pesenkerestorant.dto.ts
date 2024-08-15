import { Expose, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export class PesenKeRestorantDto {
  @Expose()
  id: number;

  
  @Expose()
  processDefinitionKey: string;

  @Expose()
  bpmnProcessId: string;

  @Expose()
  version: number;

  @Expose()
  path_minio: string;

  @Expose()
  servicesTask: string;

  @Expose()
  processInstanceKey: string;

  @Expose()
  formId: string;

  @Expose()
  taskDefinitionId: string;

  @Expose()
  taskId: string;
  

  

  @Expose()
  @Transform(({ value }) =>
    DateTime.fromJSDate(value).toFormat('yyyy-MM-dd HH:mm'),
  )
  createdAt: Date;

  @Expose()
  @Transform(({ value }) =>
    DateTime.fromJSDate(value).toFormat('yyyy-MM-dd HH:mm'),
  )
  updatedAt: Date;
}