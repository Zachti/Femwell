import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { LiveChatService } from './liveChat.service';
import { Message } from './entities/message.entity';
import { LiveChat } from './entities/liveChat.entity';
import { LoggerService } from '@backend/logger';
import { Role, Roles } from '@backend/infrastructure';
import { GraphQLError } from 'graphql/index';
import { RequestContext } from '../graphQL/interfaces';
import { User } from '../shared/user/entities/user.entity';
import { InjectPubSubToken } from './providers/pubSub.provider';
import { UserService } from '../shared/user/user.service';

@Resolver(() => LiveChat)
export class LiveChatResolver {
  constructor(
    @InjectPubSubToken() private pubSub: PubSub,
    private readonly liveChatService: LiveChatService,
    private readonly logger: LoggerService,
    private readonly userService: UserService,
  ) {}
  @Subscription(() => Message, {
    nullable: true,
    resolve: (value) => value.newMessage,
  })
  newMessage(@Args('liveChatId') liveChatId: number) {
    return this.pubSub.asyncIterator(`newMessage.${liveChatId}`);
  }
  @Subscription(() => User, {
    nullable: true,
    resolve: (value) => value.user,
    filter: (payload, variables) => {
      return variables.userId !== payload.typingUserId;
    },
  })
  userStartedTyping(
    @Args('liveChatId') liveChatId: number,
    @Args('userId') userId: string,
  ) {
    return this.pubSub.asyncIterator(`userStartedTyping.${liveChatId}`);
  }

  @Subscription(() => User, {
    nullable: true,
    resolve: (value) => value.user,
    filter: (payload, variables) => {
      return variables.userId !== payload.typingUserId;
    },
  })
  userStoppedTyping(
    @Args('liveChatId') liveChatId: number,
    @Args('userId') userId: string,
  ) {
    return this.pubSub.asyncIterator(`userStoppedTyping.${liveChatId}`);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => User)
  async userStartedTypingMutation(
    @Args('liveChatId') liveChatId: number,
    @Args('userId') userId: string,
    @Context() context: { req: RequestContext },
  ) {
    const user = await this.userService.findOne(userId);

    await this.pubSub.publish(`userStartedTyping.${liveChatId}`, {
      user,
      typingUserId: userId,
    });
    return user;
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => User)
  async userStoppedTypingMutation(
    @Args('liveChatId') liveChatId: number,
    @Args('userId') userId: string,
    @Context() context: { req: RequestContext },
  ) {
    const user = await this.userService.findOne(userId);

    await this.pubSub.publish(`userStoppedTyping.${liveChatId}`, {
      user,
      typingUserId: userId,
    });

    return user;
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => Message)
  async sendMessage(
    @Args('liveChatId') liveChatId: number,
    @Args('content') content: string,
    @Args('userId') userId: string,
  ) {
    const newMessage = await this.liveChatService.sendMessage(
      liveChatId,
      content,
      userId,
    );
    await this.pubSub
      .publish(`newMessage.${liveChatId}`, { newMessage })
      .then((res) => {
        this.logger.info('published', res);
      })
      .catch((err) => {
        this.logger.error('err', err);
      });

    return newMessage;
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => LiveChat)
  async createLiveChat(
    @Args('name') name: string,
    @Args('userId') userId: string,
  ) {
    return this.liveChatService.createLiveChat(name, userId);
  }

  @Roles([Role.Padulla])
  @Mutation(() => LiveChat)
  async addPadullaToLiveChat(
    @Args('liveChatId') liveChatId: number,
    @Args('userId') userId: string,
  ) {
    return this.liveChatService.addPadullaToLiveChat(liveChatId, userId);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Query(() => [LiveChat])
  async getLiveChat(@Args('liveChatId') liveChatId: number) {
    return this.liveChatService.getLiveChat(liveChatId);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Query(() => [LiveChat])
  async getPreviousChatsForUser(@Args('userId') userId: string) {
    return this.liveChatService.getPreviousChatsForUser(userId);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Query(() => [Message])
  async getMessagesForLiveChat(@Args('liveChatId') liveChatId: number) {
    return this.liveChatService.getMessagesForLiveChat(liveChatId);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => LiveChat)
  async deleteLiveChat(@Args('liveChatId') liveChatId: number) {
    return await this.liveChatService.deleteLiveChat(liveChatId);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => Boolean)
  async enterLiveChat(
    @Args('liveChatId') liveChatId: number,
    @Args('userId') userId: string,
  ) {
    await this.pubSub
      .publish(`userInLiveCha: ${liveChatId}`, {
        userId,
        liveChatId,
      })
      .catch((err) => {
        this.logger.error('pubSub error', err);
        throw new GraphQLError(`pubSub error: ${err}`, {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      });
    return true;
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => Boolean)
  async leaveChatroom(
    @Args('liveChatId') liveChatId: number,
    @Args('userId') userId: string,
  ) {
    await this.pubSub.publish(`UserLeftLiveChat: ${liveChatId}`, {
      userId,
      liveChatId,
    });
    return true;
  }
}
