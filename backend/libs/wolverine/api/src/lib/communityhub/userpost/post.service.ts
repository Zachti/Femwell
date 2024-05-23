import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostInput, UpdatePostInput } from '../../index';
import { LoggerService } from '@backend/logger';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ErrorService } from '../../shared/error/error.service';
import { Post } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
    private readonly error: ErrorService,
  ) {}
  async createPost(input: CreatePostInput): Promise<Post> {
    try {
      this.logger.info(`Creating a new post for user: ${input.username}.`);
      const result = await this.prisma.post.create({
        data: {
          username: input.username,
          content: input.content,
          userId: input.userId,
        },
      });
      this.logger.info(`Post created successfully with id: ${result.id}.`);
      return result;
    } catch (e) {
      this.error.handleError(new InternalServerErrorException(e));
    }
  }

  async updatePost(input: UpdatePostInput): Promise<Post> {
    try {
      this.logger.info(`Updating post with id: ${input.id}.`);
      const result = await this.prisma.post.update({
        where: { id: input.id, userId: input.userId },
        data: { content: input.content },
      });
      this.logger.info(`Post with id: ${input.id} updated successfully`);
      return result;
    } catch (e) {
      this.error.handleError(new InternalServerErrorException(e));
    }
  }

  async deletePost(id: string): Promise<Post> {
    try {
      this.logger.info(`Deleting post with id: ${id}.`);
      const result = await this.prisma.post.delete({ where: { id } });
      this.logger.info(`Post deleted successfully with id: ${id}.`);
      return result;
    } catch (e) {
      this.error.handleError(new NotFoundException(e));
    }
  }
}
