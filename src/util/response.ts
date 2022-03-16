import {
  IntegrationLogger,
  IntegrationWarnEventName,
} from '@jupiterone/integration-sdk-core';
import { NetboxRequestError } from '../client';

type WithUnauthorizedJobLogHandler<T> = {
  handler: () => Promise<T>;
  logger: IntegrationLogger;
  permissions: string[];
};

export async function withUnauthorizedJobLogHandler<T>({
  handler,
  logger,
  permissions,
}: WithUnauthorizedJobLogHandler<T>) {
  try {
    const respone = await handler();
    return respone;
  } catch (err) {
    if (err instanceof NetboxRequestError && err.status === 403) {
      logger.publishWarnEvent({
        name: IntegrationWarnEventName.MissingPermission,
        description: `Missing required API permissions (requiredPermissions=${permissions.join(
          ', ',
        )})`,
      });
      return;
    }

    throw err;
  }
}
