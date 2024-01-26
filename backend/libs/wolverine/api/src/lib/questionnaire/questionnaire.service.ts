import { Injectable } from '@nestjs/common';
import { CreateQuestionnaireInput } from './dto/createQuestionnaire.input';
import { LoggerService } from '@backend/logger';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Questionnaire } from '@prisma/client';
import { GraphQLError } from 'graphql';

@Injectable()
export class QuestionnaireService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
  ) {}
  async create(input: CreateQuestionnaireInput): Promise<Questionnaire> {
    try {
      this.logger.info(
        `Creating new questionnaire for user: ${input.username}.`,
      );
      const questionnaireId = uuidv4();
      const responsesData = input.responses.map((response) => ({
        question: response.question,
        response: response.response,
        questionnaireId,
      }));
      const result = await this.prisma.questionnaire.create({
        data: {
          id: questionnaireId,
          username: input.username,
          responses: {
            createMany: {
              data: responsesData,
            },
          },
        },
      });
      this.logger.info(
        `Questionnaire created successfully with id: ${result.id}.`,
      );
      return result;
    } catch (e) {
      this.logger.error('Failed to create questionnaire.');
      throw new GraphQLError('Failed to create questionnaire.', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }

  async findAll(): Promise<Questionnaire[]> {
    try {
      this.logger.info('Finding all questionnaires.');
      const result = await this.prisma.questionnaire.findMany();
      this.logger.info(
        `Successfully retrieved ${result.length} questionnaires.`,
      );
      return result;
    } catch (e) {
      this.logger.error('Failed to find questionnaires.');
      throw new GraphQLError('Failed to find questionnaires.', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }

  async findOne(id: string): Promise<Questionnaire> {
    try {
      this.logger.info(`Finding questionnaire with id: ${id}.`);
      const result = await this.prisma.questionnaire.findUnique({
        where: { id },
      });
      this.logger.info('Questionnaire found successfully.');
      return result as Questionnaire;
    } catch (e) {
      this.logger.error(`Failed to find questionnaire with id: ${id}.`);
      throw new GraphQLError(`Failed to find questionnaire with id: ${id}.`, {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }
}
