import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { ErrorService } from '../shared/error/error.service';
import { LoggerService } from '@backend/logger';
import { LiveChat, Message } from '@prisma/client';
import { CacheService } from '@backend/infrastructure';

@Injectable()
export class LiveChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly error: ErrorService,
    private readonly cacheService: CacheService,
  ) {}

  async getLiveChat(livechatId: number) {
    try {
      return this.cacheService.wrap(`${livechatId}`, async () => {
        return this.prisma.liveChat.findUniqueOrThrow({
          where: {
            id: livechatId,
          },
          include: {
            users: true,
            messages: true,
          },
        });
      });
    } catch (e) {
      this.error.handleError(new NotFoundException(e));
    }
  }

  async createLiveChat(name: string, userId: string): Promise<LiveChat> {
    try {
      this.logger.info(`Trying to create LiveChat for user with id: ${userId}`);
      const res = await this.prisma.liveChat.create({
        data: {
          name,
          users: {
            connect: {
              id: userId, // this is the id of the client that request to open the live chat
            },
          },
        },
      });
      this.logger.info(`New LiveChat created: ${JSON.stringify(res)}`);
      await this.cacheService.set(`${res.id}`, res);
      return res;
    } catch (e) {
      this.error.handleError(new InternalServerErrorException(e));
    }
  }

  async addPadullaToLiveChat(
    liveChatId: number,
    padullaId: string,
  ): Promise<LiveChat> {
    try {
      const res = await this.prisma.liveChat.update({
        where: {
          id: liveChatId,
        },
        data: {
          users: {
            connect: {
              id: padullaId,
            },
          },
        },
        include: {
          users: true, // show all users in the liveChat (padulla and client)
        },
      });
      this.logger.info(`Padulla added to LiveChat. Padulla id: ${padullaId}`);
      return res;
    } catch (e) {
      this.error.handleError(new InternalServerErrorException(e));
    }
  }

  async getPreviousChatsForUser(userId: string): Promise<LiveChat[]> {
    return this.cacheService.wrap(userId, async () => {
      return this.prisma.liveChat.findMany({
        where: {
          users: {
            some: {
              id: userId,
            },
          },
        }, // find all chat rooms that the user is in
        include: {
          users: {
            orderBy: {
              id: 'desc',
            },
          }, // show all users in the liveChat (padulla and client) order by id number.

          messages: {
            take: 1,
            orderBy: {
              createdAt: 'desc',
            },
          }, // display last message in the chat room
        },
      });
    });
  }

  async sendMessage(liveChatId: number, message: string, userId: string) {
    try {
      const res = await this.prisma.message.create({
        data: {
          content: message,
          liveChatId,
          userId,
        },
        include: {
          liveChat: {
            include: {
              users: true, // show all users in the liveChat (padulla and client)
            },
          }, // show liveChat info
          user: true, // show the user that sent the message
        },
      });
      this.logger.info(`New message sent: ${JSON.stringify(res)}`);
      await this.cacheService.del(`${liveChatId}_messages`);
      return res;
    } catch (e) {
      this.error.handleError(new InternalServerErrorException(e));
    }
  }

  async getMessagesForLiveChat(liveChatId: number): Promise<Message[]> {
    return this.cacheService.wrap(`${liveChatId}_messages`, async () => {
      return this.prisma.message.findMany({
        where: {
          liveChatId: liveChatId,
        },
        include: {
          liveChat: {
            include: {
              users: {
                orderBy: {
                  id: 'asc',
                },
              },
            },
          },
          user: true,
        },
      });
    });
  }

  async deleteLiveChat(liveChatId: number): Promise<LiveChat> {
    try {
      this.logger.info(`Deleting LiveChar with id: ${liveChatId}.`);
      const res = this.prisma.liveChat.delete({
        where: {
          id: liveChatId,
        },
      });
      this.logger.info(`LiveChat deleted: ${JSON.stringify(res)}`);
      return res;
    } catch (e) {
      this.error.handleError(new NotFoundException(e));
    }
  }

  async setMessagesAsRead(liveChatId: number): Promise<Message[]> {
    const oldestUnseenMessage = await this.prisma.message.findFirst({
      where: {
        liveChatId: liveChatId,
        seen: false,
      },
      orderBy: {
        createdAt: 'asc', // Order by creation date to get the oldest message
      },
    });

    if (!oldestUnseenMessage) {
      return [];
    }

    const messagesToUpdate = await this.prisma.message.findMany({
      where: {
        liveChatId: liveChatId,
        createdAt: {
          gte: oldestUnseenMessage.createdAt, // Filter messages from oldest to newest
        },
      },
    });

    messagesToUpdate.map(async (message) => {
      await this.prisma.message.update({
        where: {
          id: message.id,
        },
        data: {
          seen: true,
        },
      });
    });

    return messagesToUpdate;
  }

  async setMessageAsUnread(liveChatId: number): Promise<Message> {
    const lastMessage = await this.prisma.message.findFirst({
      where: {
        liveChatId: liveChatId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    await this.prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      data: {
        seen: false,
      },
    });
    return lastMessage;
  }
}
