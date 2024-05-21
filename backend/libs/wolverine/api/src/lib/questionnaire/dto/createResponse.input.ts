import { InputType, PickType } from '@nestjs/graphql';
import { Response } from '../entities/response.entity';

@InputType()
export class ResponseInput extends PickType(Response, ['question', 'answer']) {}
