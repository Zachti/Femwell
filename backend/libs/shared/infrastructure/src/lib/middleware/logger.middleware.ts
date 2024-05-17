import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();
  use(req: Request, res: Response, next: NextFunction) {
    const { method, query: queryParams, baseUrl: path, body } = req;

    this.logger.debug(`new request`, {
      queryParams,
      body,
      method,
      path,
      timestamp: new Date().toDateString(),
    });
    if (next) {
      next();
    }
  }
}
