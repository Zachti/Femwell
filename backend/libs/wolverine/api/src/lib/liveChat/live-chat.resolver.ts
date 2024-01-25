import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { LiveChatService } from './live-chat.service';
import { Message } from './entities/message.entity';
import { LoggerService } from '@backend/logger';
import { GraphQLString } from 'graphql';
import { LiveChat } from './entities/liveChat.entity';
import { Role, Roles } from '@backend/infrastructure';
import { GraphQLError } from 'graphql/index';

@Resolver(() => LiveChat)
export class LiveChatResolver {
  private pubSub: PubSub;

  constructor(
    private readonly liveChatService: LiveChatService,
    private readonly logger: LoggerService,
  ) {
    this.pubSub = new PubSub();
  }
  @Subscription(() => Message, {
    nullable: true,
    resolve: (value) => value.newMessage,
  })
  newMessage(@Args('liveChatId') liveChatId: number) {
    return this.pubSub.asyncIterator(`newMessage.${liveChatId}`);
  }
  @Subscription(() => GraphQLString, {
    nullable: true,
    resolve: (value) => value.user,
    filter: (payload, variables) => {
      return variables.userId !== payload.typingUserId;
    },
  })
  userStartedTyping(@Args('liveChatId') liveChatId: number) {
    return this.pubSub.asyncIterator(`userStartedTyping.${liveChatId}`);
  }

  @Subscription(() => GraphQLString, {
    nullable: true,
    resolve: (value) => value.user,
    filter: (payload, variables) => {
      return variables.userId !== payload.typingUserId;
    },
  })
  userStoppedTyping(@Args('liveChatId') liveChatId: number) {
    return this.pubSub.asyncIterator(`userStoppedTyping.${liveChatId}`);
  }

  @Mutation(() => GraphQLString)
  async userStartedTypingMutation(
    @Args('liveChatId') liveChatId: number,
    @Args('userId') userId: number,
  ) {
    await this.pubSub.publish(`userStartedTyping.${liveChatId}`, {
      typingUserId: userId,
    });
    return userId;
  }

  @Mutation(() => GraphQLString, {})
  async userStoppedTypingMutation(
    @Args('liveChatId') liveChatId: number,
    @Args('userId') userId: number,
  ) {
    await this.pubSub.publish(`userStoppedTyping.${liveChatId}`, {
      typingUserId: userId,
    });

    return userId;
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => Message)
  async sendMessage(
    @Args('liveChatId') liveChatId: number,
    @Args('content') content: string,
    @Args('userId') userId: number,
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
    @Args('userId') userId: number,
  ) {
    return this.liveChatService.createLiveChat(name, userId);
  }

  @Roles([Role.Padulla])
  @Mutation(() => LiveChat)
  async addPadullaToLiveChat(
    @Args('liveChatId') liveChatId: number,
    @Args('userId') userId: number,
  ) {
    return this.liveChatService.addPadullaToLiveChat(liveChatId, userId);
  }

  @Query(() => [LiveChat])
  async getLiveChat(@Args('liveChatId') liveChatId: number) {
    return this.liveChatService.getLiveChat(liveChatId);
  }

  @Query(() => [LiveChat])
  async getPreviousChatsForUser(@Args('userId') userId: number) {
    return this.liveChatService.getPreviousChatsForUser(userId);
  }

  @Query(() => [Message])
  async getMessagesForLiveChat(@Args('liveChatId') liveChatId: number) {
    return this.liveChatService.getMessagesForLiveChat(liveChatId);
  }
  @Mutation(() => LiveChat)
  async deleteLiveChat(@Args('liveChatId') liveChatId: number) {
    return await this.liveChatService.deleteLiveChat(liveChatId);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => Boolean)
  async enterLiveChat(
    @Args('liveChatId') liveChatId: number,
    @Args('userId') userId: number,
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
    @Args('userId') userId: number,
  ) {
    await this.pubSub.publish(`UserLeftLiveChat: ${liveChatId}`, {
      userId,
      liveChatId,
    });
    return true;
  }
}
