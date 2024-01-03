import { ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Request } from 'express';
import { LoggerService } from '@backend/logger';
import { commonConfig } from '@backend/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

export interface Context {
  logger: LoggerService
  requestContext: RequestContext
  request: Request
}

export interface RequestContext {
  username: string
  requestId: string
}

@Injectable()
export class GqlConfigService implements GqlOptionsFactory<ApolloFederationDriverConfig> {
  constructor(
    @Inject(commonConfig.KEY) private readonly configService: ConfigType<typeof commonConfig>,
    private readonly loggerService: LoggerService,
  ) {}
  createGqlOptions(): Omit<ApolloFederationDriverConfig, 'driver'> {
    return {
      introspection: !this.configService.isLiveEnv,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: { path: join(process.cwd(), 'apps/wv/src/graphQL/schema.gql'), federation: 2 },
      context: this.createContext.bind(this),
      playground: false,
      csrfPrevention: false,
    }
  }

  private async createContext(expressContext: any): Promise<Context> {
    const requestContext = await this.getRequestContext(expressContext)
    return {
      requestContext,
      logger: this.loggerService,
      request: expressContext.req,
    }
  }

  private async getRequestContext(expressContext: any): Promise<RequestContext> {
    const requestId = expressContext.req['id'] || randomUUID()
    const requestContext = expressContext.req.headers['context'] as string
    const jwt = expressContext.req.headers['authorization'] as string
    if (!requestContext && jwt) {
        const verifier = CognitoJwtVerifier.create({
          userPoolId: process.env['COGNITO_USER_POOL']!,
          tokenUse: 'access',
          clientId: null
        });
        const user = await verifier.verify(jwt);
        return {
          username: user.username,
          requestId,
        }
    }
    return JSON.parse(requestContext)
  }
}
