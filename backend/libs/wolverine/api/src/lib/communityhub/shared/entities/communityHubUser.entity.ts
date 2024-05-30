import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLURL } from 'graphql-scalars';

@ObjectType()
export class CommunityHubUser {
  @Field(() => GraphQLString)
  username!: string;

  @Field(() => GraphQLURL, { nullable: true })
  profilePic?: URL;
}
