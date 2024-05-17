import * as CircleCI from '@circleci/circleci-config-sdk';
import { DeployConfigService } from '../../configuration/deploy-config.service';
import { EcsServiceDeploymentVariablesConfig } from '../../configuration/deployment-config';
import { OrbsService } from '../../orbs/orbs.service';
import { KnownApp } from '../../types';
import { Builder } from '../app-builder.interface';
import { Inject } from '@nestjs/common';
import { ORBS_PROVIDER } from '../../orbs/orbs.provider';
import { DEPLOY_CONFIG_PROVIDER } from '../../configuration/deploy-config.provider';

export abstract class ECSBuilder implements Builder {
  constructor(
    @Inject(ORBS_PROVIDER) protected orbService: OrbsService,
    @Inject(DEPLOY_CONFIG_PROVIDER)
    protected deployConfigService: DeployConfigService,
  ) {}
  abstract appName: KnownApp;

  getJobs(): Array<CircleCI.Job> {
    const buildAndPushJob = this.getBuildAndPushJob();
    const updateServiceJob = this.getUpdateServiceJob();
    return [buildAndPushJob, updateServiceJob];
  }

  getBuildAndPushJob(): CircleCI.Job {
    const executor = new CircleCI.executors.DockerExecutor('cimg/node:18.16');
    const setupRemoteDocker = new CircleCI.commands.SetupRemoteDocker(
      { docker_layer_caching: true } as any, // "SetupRemoteDockerParameters" interface require a "version" parameter, BUT, according to CircleCI, we should use the "default" tag by not specifying version (https://discuss.circleci.com/t/remote-docker-image-deprecations-and-eol-for-2024/50176)
    );
    const ecrOrb = this.orbService.findOrbByName('aws-ecr');

    const buildAndPushServiceImageCommand = new CircleCI.reusable.ReusedCommand(
      ecrOrb.commands['build-and-push-image'],
      {
        repo: this.serviceConfig.ecr.ecrRepositoryName,
        tag: this.deployConfigService.config.config.environment.aws.tag,
        path: this.serviceConfig.ecr.dockerBuildPath,
        region: this.deployConfigService.config.config.environment.aws.region,
      },
    );
    const steps = [setupRemoteDocker, buildAndPushServiceImageCommand] as any;
    return new CircleCI.Job(`ECR-build-push-${this.appName}`, executor, steps);
  }

  getUpdateServiceJob(): CircleCI.Job {
    const executor = new CircleCI.executors.DockerExecutor(
      'cimg/python:3.11.2',
    );
    const awsCLIOrb = this.orbService.findOrbByName('aws-cli');
    const awsECSOrb = this.orbService.findOrbByName('aws-ecs');
    const setupAWSCLICommand = new CircleCI.reusable.ReusedCommand(
      awsCLIOrb.commands['setup'],
    );
    const updateECSServiceCommand = new CircleCI.reusable.ReusedCommand(
      awsECSOrb.commands['update-service'],
      {
        family: this.serviceConfig.ecs.taskDefinition.taskDefinitionFamilyName,
        cluster: this.serviceConfig.ecs.cluster,
        'service-name': this.serviceConfig.ecs.serviceName,
        'container-image-name-updates': `container=${this.serviceConfig.ecs.taskDefinition.taskDefinitionContainerName},tag=${this.deployConfigService.config.config.environment.aws.tag}`,
        'verify-revision-is-deployed': true,
        'poll-interval': 10,
        'max-poll-attempts': 30,
        'fail-on-verification-timeout': true,
      },
    );
    const steps = [setupAWSCLICommand, updateECSServiceCommand];
    return new CircleCI.Job(`ECS-update-${this.appName}`, executor, steps);
  }

  protected get serviceConfig(): EcsServiceDeploymentVariablesConfig {
    return this.deployConfigService.config.config.services[this.appName] as any;
  }

  addJobsToWorkflow(partialWorkflow: CircleCI.Workflow): CircleCI.Workflow {
    partialWorkflow.addJob(this.getBuildAndPushJob(), {
      context: [
        this.deployConfigService.config.config.environment.circleci.context,
      ],
    });
    partialWorkflow.addJob(this.getUpdateServiceJob(), {
      requires: [this.getBuildAndPushJob().name],
      context: [
        this.deployConfigService.config.config.environment.circleci.context,
      ],
    });
    return partialWorkflow;
  }
}
