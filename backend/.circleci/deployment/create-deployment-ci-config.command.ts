import * as CircleCI from '@circleci/circleci-config-sdk';
import { WorkflowJobAbstract } from '@circleci/circleci-config-sdk/dist/src/lib/Components/Workflow';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as child_process from 'child_process';
import * as fs from 'fs';
import { Command, CommandRunner, Option } from 'nest-commander';
import { DeployConfigService } from './configuration/deploy-config.service';
import { DeploymentEnv } from './configuration/types';
import { OrbsService } from './orbs/orbs.service';
import { KnownApp } from './types';
import { AppBuilderService } from './builders/appBuilder.service';
import { DEPLOY_CONFIG_PROVIDER } from './configuration/deploy-config.provider';
import { ORBS_PROVIDER } from './orbs/orbs.provider';
import { CreateWorkflowAndJobsResponse } from './interface';

@Injectable()
@Command({
  name: 'CreateDeploymentCIConfigCommand',
  options: { isDefault: true },
})
export class CreateDeploymentCiConfigCommand extends CommandRunner {
  private readonly logger = new Logger(CreateDeploymentCiConfigCommand.name);

  constructor(
    @Inject(ORBS_PROVIDER) private readonly orbService: OrbsService,
    @Inject(DEPLOY_CONFIG_PROVIDER)
    private readonly deployConfigService: DeployConfigService,
    private readonly appBuilderService: AppBuilderService,
  ) {
    super();
  }

  @Option({ name: 'branch', flags: '--branch <Branch>' })
  getBranch(branchName: string): string {
    return branchName;
  }

  @Option({ name: 'tag', flags: '--tag <Tag>' })
  getTag(tag: string): string {
    return tag;
  }

  run(
    passedParams: string[],
    options: Record<'branch' | 'tag', string>,
  ): Promise<void> {
    try {
      this.logger.debug('command initiated', { options });
      const { tag, branch } = options;
      const deploymentEnv = this.getDeploymentEnv({ tag, branch });
      this.deployConfigService.initializeConfigVariables(deploymentEnv);
      this.logger.debug(`Creating workflow to deploy to ${deploymentEnv}`);
      const appsToBuild = this.getAppsToBuild();
      this.generateCIConfigFile(appsToBuild);
      return Promise.resolve();
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e : new Error(`unknownError: ${e}`);
      this.logger.error(`error while handling command: ${errorMessage}`);
      process.exit(1); // to signal CircleCI that this step failed...
    }
  }

  private getAppsToBuild(): KnownApp[] {
    const affectedProjects = this.getAffectedNXProjects();
    if (!affectedProjects) {
      throw new Error(`No apps to deploy`);
    }
    affectedProjects.forEach((project) => {
      if (!Object.keys(KnownApp).includes(project)) {
        throw new Error(`unknown app: ${project}`);
      }
    });
    return affectedProjects as KnownApp[];
  }

  private getAffectedNXProjects(): string[] {
    const [base, head] =
      this.deployConfigService.deployEnv === DeploymentEnv.Development
        ? ['origin/dev~1', 'origin/dev']
        : ['origin/main~2', 'origin/main'];
    const nxDiffFlags = `--base=${base} --head=${head}`;
    const appCommand = `./node_modules/.bin/nx print-affected --type=app ${nxDiffFlags}`;
    this.logger.debug('calculating affected apps', { appCommand });
    const affectedAppsStr = child_process.execSync(appCommand);
    const fixedOutput =
      affectedAppsStr
        .toString()
        .trim()
        .replace(/(,)\s*$/, '') + '}}}';
    const parsedApps = JSON.parse(fixedOutput ?? '{}');
    return parsedApps.projects ?? [];
  }

  private getDeploymentEnv(params: {
    tag: string;
    branch: string;
  }): DeploymentEnv {
    const { tag, branch } = params;
    if (!tag == !branch) {
      throw new Error(
        'Exactly one option should be given. either "--tag" or "--branch"',
      );
    }
    return tag ? DeploymentEnv.Production : DeploymentEnv.Development;
  }

  private generateCIConfigFile(appsToBuild: KnownApp[]): void {
    this.logger.debug(`Creating CI config to deploy apps`, {
      appsToDeploy: appsToBuild,
    });
    const { workflow, jobs } = this.createWorkflowAndJobs(appsToBuild);
    const config = new CircleCI.Config(
      false,
      jobs,
      [workflow],
      undefined,
      undefined,
      undefined,
      this.orbService.orbs,
    );
    this.writeConfigFile(config);
  }

  private createWorkflowAndJobs(
    appsToBuild: Array<KnownApp>,
  ): CreateWorkflowAndJobsResponse {
    const configFileJobs: CircleCI.Job[] = [];
    const workflow = new CircleCI.Workflow(
      `deploy-${this.deployConfigService.deployEnv}`,
    );
    const builders = appsToBuild.map((app) =>
      this.appBuilderService.appNameToBuilder(app),
    );
    builders.forEach((builder) => {
      const jobs = builder.getJobs();
      configFileJobs.push(...jobs);
      builder.addJobsToWorkflow(workflow);
    });
    workflow.jobs.forEach((j) => this.addJobConditionsParams(j));
    return { workflow, jobs: configFileJobs };
  }

  private addJobConditionsParams(job: WorkflowJobAbstract): void {
    const deployEnv = this.deployConfigService.deployEnv;
    job.parameters ??= {};
    if (deployEnv === DeploymentEnv.Production) {
      // According to CircleCI, all jobs must contain tags conditions in ca that the workflow has been triggered by tag... https://circleci.com/docs/workflows/#executing-workflows-for-a-git-tag
      job.parameters['filters'] = {
        tags: { only: ['/^.*/'] },
        branches: { ignore: ['/.*/'] },
      };
    }
  }

  private writeConfigFile(config: CircleCI.Config): void {
    const path = './deployment.json';
    this.logger.debug(`writing config file file`, {
      path,
      config: JSON.stringify(config.generate()),
    });
    fs.writeFileSync(path, JSON.stringify(config.generate()));
  }
}
