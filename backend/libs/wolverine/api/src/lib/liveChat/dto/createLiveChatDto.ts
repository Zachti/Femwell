import { InputType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreateLiveChatDto {
  @Field(() => GraphQLString)
  name!: string;

  @Field(() => [GraphQLString])
  userIds!: string[];
}
