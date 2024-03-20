import { Injectable } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput } from '../../index';
import { LoggerService } from '@backend/logger';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ErrorService } from '../error/error.service';
import { User } from '@prisma/client';
import { InternalServerError, NotFoundError } from '../error/customErrors';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
    private readonly error: ErrorService,
  ) {}
  async createUser(input: CreateUserInput): Promise<User> {
    try {
      this.logger.info(
        `Creating a new user in db for cognito user: ${input.username}.`,
      );
      const result = await this.prisma.user.create({
        data: {
          id: input.cognitoUserId || uuidv4(), // the || is for dev phase
          username: input.username,
        },
      });
      this.logger.info(`User created successfully with id: ${result.id}.`);
      return result;
    } catch (e) {
      this.error.handleError(new InternalServerError());
    }
  }

  async updateUser(input: UpdateUserInput): Promise<User> {
    try {
      this.logger.info(
        `Updating a user in db with old username: ${input.prevUsername}.`,
      );
      const result = await this.prisma.user.update({
        where: { id: input.userId },
        data: { username: input.newUsername ?? input.prevUsername },
      });
      this.logger.info(
        `User updated successfully, new username is: ${result.username}.`,
      );
      return result;
    } catch (e) {
      this.error.handleError(new NotFoundError());
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      this.logger.info(`Deleting user with id: ${id}.`);
      const result = await this.prisma.user.delete({ where: { id } });
      this.logger.info(`User deleted successfully with id: ${id}.`);
      return result;
    } catch (e) {
      this.error.handleError(new NotFoundError());
    }
  }

  async findAll(): Promise<User[]> {
    try {
      this.logger.info('Finding all users.');
      const result = await this.prisma.user.findMany({
        include: {
          posts: true,
          comments: true,
          likes: true,
          questionnaire: {
            include: {
              responses: true,
            },
          },
        },
      });
      this.logger.info(`Successfully retrieved ${result.length} users.`);
      return result;
    } catch (e) {
      this.error.handleError(new InternalServerError());
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      this.logger.info(`Finding user with id: ${id}.`);
      const result = await this.prisma.user.findUnique({
        where: { id },
        include: {
          posts: true,
          comments: true,
          likes: true,
          questionnaire: {
            include: {
              responses: true,
            },
          },
        },
      });
      this.logger.info('User found successfully.');
      return result;
    } catch (e) {
      this.error.handleError(new NotFoundError());
    }
  }
}
