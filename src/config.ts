import {
  IntegrationExecutionContext,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
  IntegrationValidationError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { NetboxClient, NetboxRequestError } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  host: {
    type: 'string',
  },
  apiKey: {
    type: 'string',
    mask: true,
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  host: string;
  apiKey: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { host, apiKey } = context.instance.config;

  if (!host || !apiKey) {
    throw new IntegrationValidationError(
      'Config requires all of {host, apiKey}',
    );
  }

  const client = new NetboxClient({ host, apiKey });

  try {
    await client.status();
  } catch (err) {
    const responseError = err as NetboxRequestError;

    throw new IntegrationProviderAuthenticationError({
      ...responseError,
    });
  }
}
