import { InputType, Field, PickType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { LiveChat } from '../entities/liveChat.entity';

@InputType()
export class CreateLiveChatDto extends PickType(LiveChat, ['name']) {
  @Field(() => [GraphQLString])
  userIds!: string[];
}
