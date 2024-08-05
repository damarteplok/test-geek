import { UserStatusEnum } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, { message: 'Name cannot be longer than 256 characters' })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, { message: 'Name cannot be longer than 256 characters' })
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, { message: 'Name cannot be longer than 256 characters' })
  contact: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;

  @ApiProperty()
  @IsOptional()
  roleId: number;
}
