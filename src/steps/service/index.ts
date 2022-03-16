import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { NetboxClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Steps } from '../constants';
import { createServiceEntity } from './converter';

export async function fetchService({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { host, apiKey } = instance.config;

  const apiClient = new NetboxClient({ host, apiKey });
  const status = await apiClient.status();

  await jobState.addEntity(
    createServiceEntity({
      accountName: instance.name,
      host,
      data: status,
    }),
  );
}

export const serviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.SERVICE,
    name: 'Fetch Service',
    entities: [Entities.SERVICE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchService,
  },
];
