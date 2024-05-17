import * as CircleCI from '@circleci/circleci-config-sdk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrbsService {
  readonly #orbs: Array<CircleCI.orb.OrbImport>;
  constructor() {
    this.#orbs = this.generateOrbs();
  }

  get orbs(): Array<CircleCI.orb.OrbImport> {
    return this.#orbs;
  }

  private generateOrbs(): Array<CircleCI.orb.OrbImport> {
    return [
      new CircleCI.orb.OrbImport('node', 'circleci', 'node', '4.7'),
      new CircleCI.orb.OrbImport(
        'aws-ecr',
        'circleci',
        'aws-ecr',
        '8.2.1',
        '',
        {
          jobs: {},
          executors: {},
          commands: {
            'build-and-push-image':
              new CircleCI.parameters.CustomParametersList([
                new CircleCI.parameters.CustomParameter('repo', 'string'),
                new CircleCI.parameters.CustomParameter('tag', 'string'),
                new CircleCI.parameters.CustomParameter('path', 'string'),
                new CircleCI.parameters.CustomParameter('region', 'string'),
                new CircleCI.parameters.CustomParameter(
                  'extra-build-args',
                  'string',
                ),
              ]),
          },
        },
      ),
      new CircleCI.orb.OrbImport(
        'aws-ecs',
        'circleci',
        'aws-ecs',
        '3.2.0',
        '',
        {
          jobs: {},
          commands: {
            'update-service': new CircleCI.parameters.CustomParametersList([
              new CircleCI.parameters.CustomParameter('family', 'string'),
              new CircleCI.parameters.CustomParameter('cluster', 'string'),
              new CircleCI.parameters.CustomParameter('service-name', 'string'),
              new CircleCI.parameters.CustomParameter(
                'container-image-name-updates',
                'string',
              ),
              new CircleCI.parameters.CustomParameter(
                'verify-revision-is-deployed',
                'boolean',
              ),
              new CircleCI.parameters.CustomParameter(
                'poll-interval',
                'integer',
              ),
              new CircleCI.parameters.CustomParameter(
                'max-poll-attempts',
                'integer',
              ),
              new CircleCI.parameters.CustomParameter(
                'fail-on-verification-timeout',
                'boolean',
              ),
            ]),
          },
          executors: {},
        },
      ),
      new CircleCI.orb.OrbImport(
        'aws-cli',
        'circleci',
        'aws-cli',
        '3.1.4',
        '',
        {
          jobs: {},
          commands: {
            setup: new CircleCI.parameters.CustomParametersList(),
          },
          executors: {},
        },
      ),
      new CircleCI.orb.OrbImport('nx', 'nrwl', 'nx', '1.6.1'),
    ];
  }

  findOrbByName(orbName: string): CircleCI.orb.OrbImport {
    const foundOrb = this.#orbs.find((orb) => orb.name === orbName);
    if (!foundOrb) {
      throw new Error(`cannot find orb by name: ${orbName}`);
    }
    return foundOrb;
  }
}
