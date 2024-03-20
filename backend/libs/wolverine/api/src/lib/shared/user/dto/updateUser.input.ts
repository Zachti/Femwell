import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@InputType()
export class UpdateUserInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => GraphQLString, {
    description: 'The old username of the user',
  })
  prevUsername!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => GraphQLString, {
    description: 'The new username of the user',
  })
  newUsername?: string;

  @IsUUID()
  @IsNotEmpty()
  @Field(() => GraphQLUUID, {
    description: 'The unique id of the user',
  })
  userId!: string;
}
