import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@InputType()
export class PostsFilter {
  @Field(() => [GraphQLUUID], { nullable: true })
  ids?: string[];

  @Field(() => [GraphQLString], { nullable: true })
  usernames?: string[];
}
