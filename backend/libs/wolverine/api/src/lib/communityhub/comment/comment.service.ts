import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCommentInput,
  UpdateCommentInput,
  UserService,
} from '../../index';
import { LoggerService } from '@backend/logger';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ErrorService } from '../../shared/error/error.service';
import { Comment } from '@prisma/client';
import { SqsService } from '../../sqs/sqs.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
    private readonly error: ErrorService,
    private readonly sqs: SqsService,
    private readonly userService: UserService,
  ) {}
  async createComment(input: CreateCommentInput): Promise<Comment> {
    try {
      this.logger.info(`Creating a new comment on post: ${input.postId}.`);
      const result = await this.prisma.comment.create({
        data: {
          content: input.content,
          userId: input.userId,
          postId: input.postId,
        },
      });
      this.logger.info(`Comment created successfully with id: ${result.id}.`);
      if (input.mentionedUserId) {
        const user = await this.userService.findOne(input.mentionedUserId);
        await this.sqs.sendMessage(
          JSON.stringify({
            userWhoMentioned: input.username,
            phoneNumber: user.phoneNumber,
            username: user.username,
          }),
        );
      }
      return result;
    } catch (e) {
      this.error.handleError(new InternalServerErrorException(e));
    }
  }

  async updateComment(input: UpdateCommentInput): Promise<Comment> {
    try {
      this.logger.info(
        `Updating comment with id: ${input.id}. on post ${input.postId}`,
      );
      const result = await this.prisma.comment.update({
        where: { id: input.id },
        data: { content: input.content },
      });
      if (input.mentionedUserId) {
        const userWhoMentioned = await this.userService.findOne(result.userId);
        const user = await this.userService.findOne(input.mentionedUserId);
        await this.sqs.sendMessage(
          JSON.stringify({
            userWhoMentioned: userWhoMentioned.username,
            phoneNumber: user.phoneNumber,
            username: user.username,
          }),
        );
      }
      this.logger.info(`Comment with id: ${input.id} updated successfully`);
      return result;
    } catch (e) {
      this.error.handleError(new NotFoundException(e));
    }
  }

  async deleteComment(id: number, userId: string): Promise<Comment> {
    try {
      this.logger.info(`Deleting comment with id: ${id}.`);
      const result = await this.prisma.comment.delete({
        where: { id, userId },
      });
      this.logger.info(`Comment deleted successfully with id: ${id}.`);
      return result;
    } catch (e) {
      this.error.handleError(new NotFoundException(e));
    }
  }

  async getComments(postId: string): Promise<Comment[]> {
    try {
      this.logger.info(`fetching all comments from post with id: ${postId}.`);
      const result = await this.prisma.comment.findMany({
        where: { postId },
        include: {
          user: {
            select: {
              profilePic: true,
            },
          },
        },
      });
      this.logger.info(`Successfully retrieved ${result.length} comments.`);
      return result;
    } catch (e) {
      this.error.handleError(new NotFoundException(e));
    }
  }
}
