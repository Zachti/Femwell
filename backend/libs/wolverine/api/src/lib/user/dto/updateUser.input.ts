import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLPhoneNumber, GraphQLURL, GraphQLUUID } from 'graphql-scalars';
import { Role } from '@backend/infrastructure';

@InputType()
export class UpdateUserInput {
  @Field(() => GraphQLUUID)
  id!: string;

  @Field(() => GraphQLString)
  username!: string;

  @Field(() => [GraphQLURL], { nullable: true })
  profilePic?: URL;

  @Field(() => GraphQLPhoneNumber, { nullable: true })
  phoneNumber?: string;

  @Field(() => GraphQLString, {
    description: 'The new username of the user',
    nullable: true,
  })
  newUsername?: string;

  @Field(() => [GraphQLString], { nullable: true })
  readLater?: string[];

  @Field(() => Role, { nullable: true })
  role?: Role;
}
