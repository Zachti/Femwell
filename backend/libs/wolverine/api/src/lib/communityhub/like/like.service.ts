import { Injectable } from '@nestjs/common';
import { CreateLikeInput } from '../../index';
import { LoggerService } from '@backend/logger';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ErrorService } from '../../shared/error/error.service';
import { Like } from '@prisma/client';
import {
  InternalServerError,
  NotFoundError,
} from '../../shared/error/customErrors';

@Injectable()
export class LikeService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
    private readonly error: ErrorService,
  ) {}
  async createLike(input: CreateLikeInput): Promise<Like> {
    try {
      this.logger.info(`Creating a new like on post: ${input.postId}.`);
      const result = await this.prisma.like.create({
        data: {
          username: input.username,
          userId: input.userId,
          postId: input.postId,
        },
      });
      this.logger.info(`Like created successfully with id: ${result.id}.`);
      return result;
    } catch (e) {
      this.error.handleError(new InternalServerError());
    }
  }

  async deleteLike(postId: string, userId: string): Promise<boolean> {
    try {
      this.logger.info(`Deleting like on post: ${postId}.`);
      const result = await this.prisma.like.deleteMany({
        where: { postId, userId },
      });
      if (result.count !== 0) {
        this.logger.info(`Like deleted successfully on post: ${postId}.`);
        return true;
      }
    } catch (e) {
      this.error.handleError(new InternalServerError());
    }
  }

  async getLikes(postId: string): Promise<Like[]> {
    try {
      this.logger.info(`fetching all likes on post with id: ${postId}.`);
      const result = await this.prisma.like.findMany({ where: { postId } });
      this.logger.info(`Successfully retrieved ${result.length} likes.`);
      return result;
    } catch (e) {
      this.error.handleError(new NotFoundError());
    }
  }
}
