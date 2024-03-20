import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';
import { GraphQLString } from 'graphql/type';

@InputType()
export class ResponseInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => GraphQLString)
  question!: string;

  @IsString()
  @Field(() => GraphQLString, { nullable: true })
  answer?: string;
}
