import {
  IntegrationExecutionContext,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
  IntegrationValidationError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { NetboxClient, NetboxRequestError } from './client';

/**
 * A type describing the configuration fields required to execute the
 * integration for a specific account in the data provider.
 *
 * When executing the integration in a development environment, these values may
 * be provided in a `.env` file with environment variables. For example:
 *
 * - `CLIENT_ID=123` becomes `instance.config.clientId = '123'`
 * - `CLIENT_SECRET=abc` becomes `instance.config.clientSecret = 'abc'`
 *
 * Environment variables are NOT used when the integration is executing in a
 * managed environment. For example, in JupiterOne, users configure
 * `instance.config` in a UI.
 */
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
