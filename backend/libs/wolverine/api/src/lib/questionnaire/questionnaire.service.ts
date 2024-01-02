import { Injectable } from '@nestjs/common';
import { CreateQuestionnaireInput } from './dto/createQuestionnaire.input';
import { QuestionnaireRepository } from './repository/Questionnaire.repository';
import { Questionnaire } from './entities/questionnaire.entity';
import { LoggerService } from '@backend/logger';

@Injectable()
export class QuestionnaireService {
  constructor(
    private readonly questionnaireRepository: QuestionnaireRepository,
    private readonly logger: LoggerService,
  ) {}
  async create(input: CreateQuestionnaireInput): Promise<Questionnaire> {
    try {
      this.logger.info(
        `Creating new questionnaire for user: ${input.username}.`,
      );
      const result = await this.questionnaireRepository.create(input);
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
      const result = await this.questionnaireRepository.findAll();
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
      const result = await this.questionnaireRepository.findOne(id);
      this.logger.info('Questionnaire found successfully.');
      return result;
    } catch (e) {
      this.logger.error(`Failed to find questionnaire with id: ${id}.`);
      throw e;
    }
  }
}
