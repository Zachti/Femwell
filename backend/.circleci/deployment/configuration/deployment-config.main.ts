import { KnownApp } from '../types';
import { DeploymentVariablesConfig } from './deployment-config';

export const deploymentConfigMain: DeploymentVariablesConfig = {
  config: {
    environment: {
      aws: {
        tag: '${CIRCLE_TAG}',
        region: 'eu-east-1',
      },
      circleci: {
        context: 'production',
      },
    },
    services: {
      [KnownApp['wolverine']]: {
        ecr: {
          dockerBuildPath: './apps/wolverine',
          ecrRepositoryName: 'wolverine',
        },
        ecs: {
          cluster: 'femwell',
          serviceName: 'wolverine',
          taskDefinition: {
            taskDefinitionContainerName: 'wolverine',
            taskDefinitionFamilyName: 'wolverine',
          },
        },
      },
      [KnownApp['vault']]: {
        ecr: {
          dockerBuildPath: './apps/vault',
          ecrRepositoryName: 'vault',
        },
        ecs: {
          cluster: 'femwell',
          serviceName: 'vault',
          taskDefinition: {
            taskDefinitionContainerName: 'vault',
            taskDefinitionFamilyName: 'vault',
          },
        },
      },
      [KnownApp['heimdall']]: {
        ecr: {
          dockerBuildPath: './apps/heimdall',
          ecrRepositoryName: 'heimdall',
        },
        ecs: {
          cluster: 'femwell',
          serviceName: 'heimdall',
          taskDefinition: {
            taskDefinitionContainerName: 'heimdall',
            taskDefinitionFamilyName: 'heimdall',
          },
        },
      },
      [KnownApp['denden']]: {
        ecr: {
          dockerBuildPath: './apps/denden',
          ecrRepositoryName: 'denden',
        },
        ecs: {
          cluster: 'femwell',
          serviceName: 'denden',
          taskDefinition: {
            taskDefinitionContainerName: 'denden',
            taskDefinitionFamilyName: 'denden',
          },
        },
      },
    },
  },
};
