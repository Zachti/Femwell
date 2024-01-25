import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '@backend/logger';
import { GraphQLError } from 'graphql';
import { LiveChat, Message } from '@prisma/client';

@Injectable()
export class LiveChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getLiveChat(id: string) {
    return this.prisma['liveChat'].findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }

  async createLiveChat(name: string, userId: number): Promise<LiveChat> {
    const existingLiveChat = await this.prisma['liveChat'].findFirst({
      where: {
        name,
      },
    });
    if (existingLiveChat) {
      this.logger.error('LiveChat already exists');
      throw new GraphQLError('LiveChat already exists', {
        extensions: {
          code: 'BAD_REQUEST',
        },
      });
    }
    const res = this.prisma['liveChat'].create({
      data: {
        name,
        users: {
          connect: {
            id: userId, // this is the id of the client that request to open the live chat
          },
        },
      },
    });
    this.logger.info(`New chat room created: ${JSON.stringify(res)}`);
    return res;
  }

  async addPadullaToLiveChat(
    liveChatId: number,
    padullaId: number,
  ): Promise<LiveChat> {
    const existingLiveChat = await this.prisma['liveChat'].findUnique({
      where: {
        id: liveChatId,
      },
    });
    if (!existingLiveChat) {
      this.logger.error('LiveChat does not exist');
      throw new GraphQLError('LiveChat does not exist', {
        extensions: {
          code: 'BAD_REQUEST',
        },
      });
    }

    const res = await this.prisma['liveChat'].update({
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
        users: true, // Eager loading users
      },
    });
    this.logger.info(`padulla added to liveChat. padulla id: ${padullaId}`);
    return res;
  }

  async getPreviousChatsForUser(userId: number): Promise<LiveChat[]> {
    return this.prisma['liveChat'].findMany({
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
        }, // show all users in the liveChat (padulla and client)

        messages: {
          take: 1,
          orderBy: {
            id: 'desc',
          },
        }, // display last message in the chat room
      },
    });
  }

  async sendMessage(liveChatId: number, message: string, userId: number) {
    const res = await this.prisma['message'].create({
      data: {
        content: message,
        liveChatId,
        userId,
      },
      include: {
        liveChat: {
          include: {
            users: true, // Eager loading users
          },
        }, // Eager loading liveChat
        user: true, // Eager loading User
      },
    });
    this.logger.info(`New message sent: ${JSON.stringify(res)}`);
    return res;
  }

  async getMessagesForLiveChat(liveChatId: number): Promise<Message[]> {
    return this.prisma['message'].findMany({
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
  }

  async deleteLiveChat(liveChatId: number): Promise<LiveChat> {
    const res = this.prisma['liveChat'].delete({
      where: {
        id: liveChatId,
      },
    });
    this.logger.info(`LiveChat deleted: ${JSON.stringify(res)}`);
    return res;
  }
}
