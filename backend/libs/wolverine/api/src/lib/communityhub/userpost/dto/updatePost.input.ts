import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@InputType()
export class UpdatePostInput {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => GraphQLUUID, {
    description: 'The id of the post itself',
  })
  id!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => GraphQLString, {
    description: 'The new content of the post',
  })
  content!: string;

  @IsUUID()
  @IsNotEmpty()
  @Field(() => GraphQLUUID, {
    description: 'The unique id of the user',
  })
  userId!: string;
}
