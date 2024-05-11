import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { GraphQLString } from 'graphql/type';

@InputType()
export class UpdateUserInput extends PickType(User, [
  'id',
  'username',
  'phoneNumber',
]) {
  @Field(() => GraphQLString, {
    description: 'The new username of the user',
  })
  newUsername?: string;

  @Field(() => [GraphQLString], { nullable: true })
  readLater?: string[];
}
