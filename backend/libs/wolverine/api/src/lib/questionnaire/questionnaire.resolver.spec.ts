import { Test, TestingModule } from '@nestjs/testing';
import { QuestionnaireResolver } from './questionnaire.resolver';
import { QuestionnaireService } from './questionnaire.service';

describe('QuestionnaireResolver', () => {
  let resolver: QuestionnaireResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionnaireResolver, QuestionnaireService],
    }).compile();

    resolver = module.get<QuestionnaireResolver>(QuestionnaireResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
