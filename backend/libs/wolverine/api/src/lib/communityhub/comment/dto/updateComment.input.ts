import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { GraphQLPositiveInt, GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@InputType()
export class UpdateCommentInput {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => GraphQLPositiveInt, {
    description: 'The id of the comment',
  })
  id!: number;

  @IsString()
  @IsNotEmpty()
  @Field(() => GraphQLString, {
    description: 'The new content of the comment',
  })
  content!: string;

  @IsUUID()
  @IsNotEmpty()
  @Field(() => GraphQLUUID, {
    description: 'The unique id of the user',
  })
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  @Field(() => GraphQLUUID, {
    description: 'The unique id of the post',
  })
  postId!: string;
}
