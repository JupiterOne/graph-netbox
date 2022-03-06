import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function buildAccountEntityKey(accountName: string) {
  return `netbox_account_${accountName}`;
}

export function createAccountEntity({
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
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        _key: buildAccountEntityKey(accountName),
        name: accountName,
        displayName: accountName,
        netboxVersion: data['netbox-version'],
        pythonVersion: data['python-version'],
        djangoVersion: data['django-version'],
        rqWorkersRunning: data['rq-workers-running'],
        webLink: host,
      },
    },
  });
}
