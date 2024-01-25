import { Injectable } from '@nestjs/common';
import { CreateQuestionnaireInput } from './dto/createQuestionnaire.input';
import { Questionnaire } from './entities/questionnaire.entity';
import { LoggerService } from '@backend/logger';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

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
      const result = await this.prisma['Questionnaire'].create({
        data: {
          id: uuidv4(),
          username: input.username,
          responses: {
            create: input.responses,
          },
        },
      });
      this.logger.info(
        `Questionnaire created successfully with id: ${result.id}.`,
      );
      return result;
    } catch (e) {
      this.logger.error('Failed to create questionnaire.');
      throw e;
    }
  }

  async findAll(): Promise<Questionnaire[]> {
    try {
      this.logger.info('Finding all questionnaires.');
      const result = await this.prisma['Questionnaire'].findAll();
      this.logger.info(
        `Successfully retrieved ${result.length} questionnaires.`,
      );
      return result;
    } catch (e) {
      this.logger.error('Failed to find questionnaires.');
      throw e;
    }
  }

  async findOne(id: string): Promise<Questionnaire> {
    try {
      this.logger.info(`Finding questionnaire with id: ${id}.`);
      const result = await this.prisma['Questionnaire'].findOne({
        where: { id },
        rejectOnNotFound: true,
      });
      this.logger.info('Questionnaire found successfully.');
      return result;
    } catch (e) {
      this.logger.error(`Failed to find questionnaire with id: ${id}.`);
      throw e;
    }
  }
}
