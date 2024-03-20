import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Type,
} from '@nestjs/common';
import { BadUserInputError } from '../error/customErrors';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidateInputPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;
    const object = plainToInstance(metatype as Type<any>, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadUserInputError();
    }
    return value;
  }
}
