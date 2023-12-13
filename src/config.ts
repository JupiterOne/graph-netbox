import {
  IntegrationExecutionContext,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
  IntegrationValidationError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { NetboxClient, NetboxRequestError } from './client';
import { IntegrationInfoEventName } from '@jupiterone/integration-sdk-core/dist/src/types/logger';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  host: {
    type: 'string',
    mask: false,
  },
  apiKey: {
    type: 'string',
    mask: true,
  },
  disableTlsVerification: {
    type: 'boolean',
    mask: false,
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  host: string;
  apiKey: string;
  disableTlsVerification?: boolean;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { host, apiKey, disableTlsVerification } = context.instance.config;

  if (!host || !apiKey) {
    throw new IntegrationValidationError(
      'Config requires all of {host, apiKey}',
    );
  }

  if (disableTlsVerification) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    context.logger.warn(
      `Disabled TLS certificate verification based on .env.  If possible, please install valid TLS certificates into Netbox server.`,
    );
    context.logger.publishInfoEvent({
      name: IntegrationInfoEventName.Info,
      description:
        'Disabled TLS certificate verification. Please install a valid TLS certificate on your Netbox server.',
    });
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
