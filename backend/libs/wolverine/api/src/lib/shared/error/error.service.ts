import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { LoggerService } from '@backend/logger';

@Injectable()
export class ErrorService {
  constructor(private readonly logger: LoggerService) {}
  handleError(e: any): never {
    {
      this.logger.error(e.message);
      throw new GraphQLError(e.message, {
        extensions: {
          code: e.code,
        },
      });
    }
  }
}
