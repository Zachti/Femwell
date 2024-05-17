import * as CircleCI from '@circleci/circleci-config-sdk';

export interface CreateWorkflowAndJobsResponse {
  workflow: CircleCI.Workflow;
  jobs: Array<CircleCI.Job>;
}
