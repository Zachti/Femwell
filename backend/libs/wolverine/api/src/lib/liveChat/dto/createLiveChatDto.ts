import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreateLiveChatDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  name!: string;

  @IsArray()
  @IsNotEmpty({ message: 'Users Ids required.' })
  @Field(() => [GraphQLString])
  userIds!: string[];
}
