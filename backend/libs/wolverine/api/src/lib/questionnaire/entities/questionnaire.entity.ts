import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLUUID } from 'graphql-scalars';
import { Response } from './response.entity';

@ObjectType()
export class Questionnaire {
  @Field(() => GraphQLUUID)
  id!: string;

  @Field(() => GraphQLString)
  username!: string;

  @Field(() => [Response])
  responses!: Response[];
}
