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
import { buildServiceEntityKey } from '../services/converter';
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

export async function buildServiceHasDeviceRelationship({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const serviceEntity = await jobState.findEntity(
    buildServiceEntityKey(instance.name),
  );

  if (!serviceEntity) {
    throw new IntegrationError({
      code: 'MISSING_REQUIRED_ENTITY',
      message: 'Missing required service entity',
      fatal: true,
    });
  }

  await jobState.iterateEntities(
    { _type: Entities.DEVICE._type },
    async (deviceEntity) => {
      await jobState.addRelationship(
        createDirectRelationship({
          from: serviceEntity,
          to: deviceEntity,
          _class: RelationshipClass.MANAGES,
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
    id: Steps.RELATIONSHIPS_SERVICE_DEVICE,
    name: 'Build netbox_service -HAS-> netbox_device relationships',
    entities: [],
    relationships: [Relationships.SERVICE_MANAGES_DEVICE],
    dependsOn: [Steps.SERVICE, Steps.DEVICES],
    executionHandler: buildServiceHasDeviceRelationship,
  },
];
