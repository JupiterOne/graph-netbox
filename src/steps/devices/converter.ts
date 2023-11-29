import {
  createIntegrationEntity,
  parseTimePropertyValue,
  truncateEntityPropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function createDeviceEntity(device: any, host: string) {
  return createIntegrationEntity({
    entityData: {
      source: device,
      assign: {
        _type: Entities.DEVICE._type,
        _class: Entities.DEVICE._class,
        _key: `netbox_device_${device.id}`,
        id: device.id.toString(),
        deviceId: device.id.toString(),
        name: device.name || '',
        displayName: device.display,
        category: 'network',

        // `device_type` data
        make: device.device_type?.manufacturer?.display || null,
        model: device.device_type?.model || null,
        slug: device.device_type?.slug || null,

        // `device_role` data
        roleId: device.device_role?.id,
        roleName: device.device_role?.name,

        // `site` data
        siteId: device.site?.id,
        siteName: device.site?.name,

        // `location` data
        locationId: device.location?.id,
        locationName: device.location?.name,

        // `location` data
        rackId: device.rack?.id,
        rackName: device.rack?.name,

        // IP address data
        ipAddress: device.primary_ip?.address,
        primaryIPv4Address: device.primary_ip4?.address,
        primaryIPv6Address: device.primary_ip6?.address,

        // `virtual_chassis` data
        virtualChassisId: device.virtual_chassis?.id,
        virtualChassisName: device.virtual_chassis?.name,

        // `location` data
        clusterId: device.cluster?.id,
        clusterName: device.cluster?.name,

        vcPosition: device.vc_position,
        active: device.status?.value === 'active',
        serial: device.serial,
        lastSeenOn: parseTimePropertyValue(device.last_updated),
        comments: truncateEntityPropertyValue(device.comments),
        createdOn: parseTimePropertyValue(device.created),
        updatedOn: parseTimePropertyValue(device.last_updated),
        webLink: `${host}/dcim/devices/${device.id}/`,
      },
    },
  });
}
