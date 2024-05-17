export interface EcsServiceDeploymentVariablesConfig {
  ecr: {
    ecrRepositoryName: string;
    dockerBuildPath: string;
  };
  ecs: {
    taskDefinition: {
      taskDefinitionFamilyName: string;
      taskDefinitionContainerName: string;
    };
    cluster: string;
    serviceName: string;
  };
}

export interface DeploymentVariablesConfig {
  config: {
    services: {
      wolverine: EcsServiceDeploymentVariablesConfig;
      vault: EcsServiceDeploymentVariablesConfig;
      heimdall: EcsServiceDeploymentVariablesConfig;
      denden: EcsServiceDeploymentVariablesConfig;
    };
    environment: {
      aws: {
        region: string;
        tag: string;
      };
      circleci: {
        context: string;
      };
    };
  };
}
