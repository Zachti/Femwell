import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { Role } from '@backend/infrastructure';

@InputType()
export class RegisterRequest {
  @Field(() => GraphQLString)
  username!: string;

  @Field(() => GraphQLString)
  email!: string;

  @Field(() => GraphQLString)
  password!: string;

  @Field(() => Role)
  role!: Role;

  @Field(() => GraphQLString, { nullable: true })
  phoneNumber?: string;
}
