import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionnaireInput } from './dto/createQuestionnaire.input';
import { LoggerService } from '@backend/logger';
import { PrismaService } from '../shared/prisma/prisma.service';
import { Questionnaire } from '@prisma/client';
import { ErrorService } from '../shared/error/error.service';

@Injectable()
export class QuestionnaireService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
    private readonly error: ErrorService,
  ) {}
  async createQuestionnaire(
    input: CreateQuestionnaireInput,
  ): Promise<Questionnaire> {
    try {
      this.logger.info(
        `Creating new questionnaire for user: ${input.username}.`,
      );
      const responsesData = input.responses.map((response) => ({
        question: response.question,
        answer: response.answer || '',
        questionnaireId: response.questionnaireId,
      }));
      const result = await this.prisma.questionnaire.create({
        data: {
          userId: input.userId,
          responses: {
            createMany: {
              data: responsesData,
            },
          },
        },
        include: {
          responses: true,
        },
      });
      this.logger.info(
        `Questionnaire created successfully with id: ${result.id}.`,
      );
      return result;
    } catch (e) {
      this.error.handleError(new InternalServerErrorException(e));
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
      this.error.handleError(new InternalServerErrorException(e));
    }
  }

  async findOne(id: string): Promise<Questionnaire> {
    try {
      this.logger.info(`Finding questionnaire with id: ${id}.`);
      const result = await this.prisma.questionnaire.findUnique({
        where: { id },
        include: { responses: true },
      });
      this.logger.info('Questionnaire found successfully.');
      return result;
    } catch (e) {
      this.error.handleError(new NotFoundException(e));
    }
  }

  async findOneByUser(userId: string): Promise<Questionnaire> {
    try {
      this.logger.info(`Finding questionnaire by userId: ${userId}.`);
      const result = await this.prisma.questionnaire.findUnique({
        where: { userId },
        include: { responses: true },
      });
      this.logger.info('Questionnaire found successfully.');
      return result;
    } catch (e) {
      this.logger.error(
        `Failed to find questionnaire with for the user: ${userId}, possibly haven't created one.`,
      );
      this.error.handleError(new NotFoundException(e));
    }
  }
}
