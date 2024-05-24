import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';

@InputType()
export class ResponseInput {
  @Field(() => GraphQLString)
  question!: string;

  @Field(() => GraphQLString, { nullable: true })
  answer?: string;
}
