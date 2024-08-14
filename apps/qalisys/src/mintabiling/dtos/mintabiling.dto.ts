import { Expose, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export class MintaBilingDto {
  @Expose()
  id: number;

  

  
  @Expose()
  processDefinitionKey: string;

  @Expose()
  processVariables: string;

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
  created_at: Date;

  @Expose()
  @Transform(({ value }) =>
    DateTime.fromJSDate(value).toFormat('yyyy-MM-dd HH:mm'),
  )
  updated_at: Date;
}