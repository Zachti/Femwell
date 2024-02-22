import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreateLikeInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => GraphQLString, {
    description: 'The username of the user',
  })
  username!: string;

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
