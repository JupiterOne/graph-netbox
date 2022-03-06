import { RelationshipClass } from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  DEVICES: 'fetch-devices',

  RELATIONSHIPS_ACCOUNT_DEVICE: 'build-account-device-relationships',
};

export const Entities = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'netbox_account',
    _class: ['Account'],
    schema: {
      properties: {
        netboxVersion: { type: ['string', 'null'] },
        pythonVersion: { type: ['string', 'null'] },
        djangoVersion: { type: ['string', 'null'] },
        rqWorkersRunning: { type: ['number', 'null'] },
      },
    },
  },
  DEVICE: {
    resourceName: 'Device',
    _type: 'netbox_device',
    _class: ['Device'],
    schema: {
      properties: {
        active: { type: 'boolean' },
        slug: { type: ['string', 'null'] },
        manufacturer: { type: ['string', 'null'] },
        vcPosition: { type: ['number', 'null'] },
        comments: { type: ['string', 'null'] },

        roleId: { type: ['number', 'null'] },
        roleName: { type: ['string', 'null'] },

        siteId: { type: ['number', 'null'] },
        siteName: { type: ['string', 'null'] },

        locationId: { type: ['number', 'null'] },
        locationName: { type: ['string', 'null'] },

        rackId: { type: ['number', 'null'] },
        rackName: { type: ['string', 'null'] },

        ipAddress: { type: ['string', 'null'] },
        primaryIPv4Address: { type: ['string', 'null'] },
        primaryIPv6Address: { type: ['string', 'null'] },

        virtualChassisId: { type: ['number', 'null'] },
        virtualChassisName: { type: ['string', 'null'] },

        clusterId: { type: ['number', 'null'] },
        clusterName: { type: ['string', 'null'] },
      },
    },
  },
};

export const Relationships = {
  ACCOUNT_HAS_DEVICE: {
    _type: 'netbox_account_has_device',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.DEVICE._type,
  },
};
