import { createMockExecutionContext } from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig, validateInvocation } from './config';
import {
  IntegrationProviderAuthenticationError,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';

describe('#validateInvocation', () => {
  it('requires valid config', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {} as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      IntegrationValidationError,
    );
  });

  it('successfully validates invocation', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: { apiKey: 'test', host: 'host.com' } as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      IntegrationProviderAuthenticationError,
    );
  });
});
