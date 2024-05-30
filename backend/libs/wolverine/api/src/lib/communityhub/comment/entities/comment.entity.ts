import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLUUID, GraphQLPositiveInt, GraphQLDate } from 'graphql-scalars';
import { CommunityHubUser } from '../../shared/entities/communityHubUser.entity';

@ObjectType()
export class Comment {
  @Field(() => GraphQLPositiveInt)
  id!: number;

  @Field(() => GraphQLString)
  content!: string;

  @Field(() => GraphQLUUID)
  userId!: string;

  @Field(() => GraphQLUUID)
  postId!: string;

  @Field(() => GraphQLDate)
  createdAt!: Date;

  @Field(() => CommunityHubUser)
  user!: CommunityHubUser;
}
