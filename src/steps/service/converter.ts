import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function buildServiceEntityKey(accountName: string) {
  return `netbox_service_${accountName}`;
}

export function createServiceEntity({
  accountName,
  data,
  host,
}: {
  accountName: string;
  data: any;
  host: string;
}) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _type: Entities.SERVICE._type,
        _class: Entities.SERVICE._class,
        _key: buildServiceEntityKey(accountName),
        name: accountName,
        displayName: accountName,
        category: ['infrastructure', 'network'],
        function: ['networking'],
        netboxVersion: data['netbox-version'],
        pythonVersion: data['python-version'],
        djangoVersion: data['django-version'],
        rqWorkersRunning: data['rq-workers-running'],
        webLink: host,
      },
    },
  });
}
