import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { getRepository } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [EntityClass, property] = args.constraints;
    const entity = await getRepository(EntityClass).findOne({
      where: { [property]: value },
    });
    return !entity;
  }

  defaultMessage(args: ValidationArguments) {
    const [EntityClass, property] = args.constraints;
    return `${property} must be unique`;
  }
}

export function IsUnique(
  EntityClass: Function,
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [EntityClass, property],
      validator: IsUniqueConstraint,
    });
  };
}
