import { Injectable } from '@nestjs/common';
import { CreateCommentInput, UpdateCommentInput } from '../../index';
import { LoggerService } from '@backend/logger';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ErrorService } from '../../shared/error/error.service';
import { Comment } from '@prisma/client';
import {
  InternalServerError,
  NotFoundError,
} from '../../shared/error/customErrors';

@Injectable()
export class CommentService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
    private readonly error: ErrorService,
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
      return result;
    } catch (e) {
      this.error.handleError(new InternalServerError());
    }
  }

  async updateComment(input: UpdateCommentInput): Promise<Comment> {
    try {
      this.logger.info(
        `Updating comment with id: ${input.id}. on post ${input.postId}`,
      );
      const result = await this.prisma.comment.update({
        where: { id: input.id, userId: input.userId },
        data: { content: input.content },
      });
      this.logger.info(`Comment with id: ${input.id} updated successfully`);
      return result;
    } catch (e) {
      this.error.handleError(new NotFoundError());
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
      this.error.handleError(new NotFoundError());
    }
  }

  async getComments(postId: string): Promise<Comment[]> {
    try {
      this.logger.info(`fetching all comments from post with id: ${postId}.`);
      const result = await this.prisma.comment.findMany({ where: { postId } });
      this.logger.info(`Successfully retrieved ${result.length} comments.`);
      return result;
    } catch (e) {
      this.error.handleError(new NotFoundError());
    }
  }
}
