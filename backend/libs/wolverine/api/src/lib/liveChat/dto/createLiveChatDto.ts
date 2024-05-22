import { InputType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreateLiveChatDto {
  @Field(() => [GraphQLString])
  userIds!: string[];

  @Field(() => GraphQLString, { nullable: true }) // title of the live chat
  name!: string;
}
