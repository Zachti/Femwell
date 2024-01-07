import { Field, InputType } from '@nestjs/graphql';
import { GraphQLEmailAddress } from 'graphql-scalars';

@InputType()
export class DeleteUserRequest {
  @Field(() => GraphQLEmailAddress)
  username!: string;
}
