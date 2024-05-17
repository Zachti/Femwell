import * as CircleCI from '@circleci/circleci-config-sdk';
import { KnownApp } from '../types';
export interface Builder {
  appName: KnownApp;

  getJobs: () => Array<CircleCI.Job>;

  addJobsToWorkflow: (partialWorkflow: CircleCI.Workflow) => CircleCI.Workflow;
}
