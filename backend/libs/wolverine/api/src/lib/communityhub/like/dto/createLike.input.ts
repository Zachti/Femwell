import { Field, InputType, PickType } from '@nestjs/graphql';
import { Like } from '../entities/like.entity';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreateLikeInput extends PickType(Like, ['postId', 'userId']) {
  @Field(() => GraphQLString)
  username!: string;
}
