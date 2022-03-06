import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { NetboxClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Steps } from '../constants';
import { createAccountEntity } from './converter';

export async function fetchAccount({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { host, apiKey } = instance.config;

  const apiClient = new NetboxClient({ host, apiKey });
  const status = await apiClient.status();

  await jobState.addEntity(
    createAccountEntity({
      accountName: instance.name,
      host,
      data: status,
    }),
  );
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ACCOUNT,
    name: 'Fetch Account',
    entities: [Entities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccount,
  },
];
