import { InputType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { GraphQLUUID } from 'graphql-scalars';

@InputType()
export class CreateCommentInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => GraphQLString, {
    description: 'The username of the user',
  })
  username!: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => GraphQLString, {
    description: 'The content of the comment',
  })
  content!: string;

  @IsNotEmpty()
  @IsUUID()
  @Field(() => GraphQLUUID, {
    description: 'The unique id of the user',
  })
  userId!: string;

  @IsNotEmpty()
  @IsUUID()
  @Field(() => GraphQLUUID, {
    description: 'The unique id of the post',
  })
  postId!: string;
}
