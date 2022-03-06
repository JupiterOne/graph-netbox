import {
  createDirectRelationship,
  IntegrationError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { NetboxClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { withUnauthorizedJobLogHandler } from '../../util/response';
import { buildAccountEntityKey } from '../account/converter';
import { Entities, Steps, Relationships } from '../constants';
import { createDeviceEntity } from './converter';

export async function fetchDevices({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { host, apiKey } = instance.config;
  const apiClient = new NetboxClient({ host, apiKey });

  await withUnauthorizedJobLogHandler({
    handler: async () => {
      await apiClient.iterateDevices(async (device) => {
        await jobState.addEntity(createDeviceEntity(device, host));
      });
    },
    logger,
    permissions: ['DCIM > device'],
  });
}

export async function buildAccountHasDeviceRelationship({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = await jobState.findEntity(
    buildAccountEntityKey(instance.name),
  );

  if (!accountEntity) {
    throw new IntegrationError({
      code: 'MISSING_REQUIRED_ENTITY',
      message: 'Missing required account entity',
      fatal: true,
    });
  }

  await jobState.iterateEntities(
    { _type: Entities.DEVICE._type },
    async (deviceEntity) => {
      await jobState.addRelationship(
        createDirectRelationship({
          from: accountEntity,
          to: deviceEntity,
          _class: RelationshipClass.HAS,
        }),
      );
    },
  );
}

export const deviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICES,
    name: 'Fetch Devices',
    entities: [Entities.DEVICE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchDevices,
  },
  {
    id: Steps.RELATIONSHIPS_ACCOUNT_DEVICE,
    name: 'Build netbox_account -HAS-> netbox_device relationships',
    entities: [],
    relationships: [Relationships.ACCOUNT_HAS_DEVICE],
    dependsOn: [Steps.ACCOUNT, Steps.DEVICES],
    executionHandler: buildAccountHasDeviceRelationship,
  },
];
