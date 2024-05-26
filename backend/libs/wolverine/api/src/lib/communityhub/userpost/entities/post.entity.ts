import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLDate, GraphQLUUID } from 'graphql-scalars';
import { Like, Comment } from '../../../index';

@ObjectType()
export class Post {
  @Field(() => GraphQLUUID)
  id!: string;

  @Field(() => GraphQLString)
  username!: string;

  @Field(() => GraphQLString)
  content!: string;

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  @Field(() => [Like], { nullable: true })
  likes?: Like[];

  @Field(() => GraphQLUUID)
  userId!: string;

  @Field(() => GraphQLString, { nullable: true })
  imageUrl?: string;

  @Field(() => Boolean)
  isAnonymous!: boolean;

  @Field(() => GraphQLDate)
  createdAt!: Date;
}
