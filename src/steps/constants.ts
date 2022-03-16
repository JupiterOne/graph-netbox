import { RelationshipClass } from '@jupiterone/integration-sdk-core';

export const Steps = {
  SERVICE: 'fetch-service',
  DEVICES: 'fetch-devices',

  RELATIONSHIPS_SERVICE_DEVICE: 'build-service-device-relationships',
};

export const Entities = {
  SERVICE: {
    resourceName: 'Service',
    _type: 'netbox_service',
    _class: ['Service'],
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
  SERVICE_MANAGES_DEVICE: {
    _type: 'netbox_service_manages_device',
    sourceType: Entities.SERVICE._type,
    _class: RelationshipClass.MANAGES,
    targetType: Entities.DEVICE._type,
  },
};
