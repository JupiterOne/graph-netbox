import { IntegrationProviderAPIError } from '@jupiterone/integration-sdk-core';
import axios from 'axios';

type NetboxClientParams = {
  host: string;
  apiKey: string;
};

type NetboxApiResponse<TItem> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TItem[];
};

function buildApiUrl(host: string, endpoint: string) {
  return host + endpoint;
}

export class NetboxRequestError extends IntegrationProviderAPIError {
  /**
   * Error details in the Netbox response object
   *
   * e.g.
   *
   * {
   *   "details": "You do not have permission to perform this action."
   * }
   */
  public readonly detail?: string;

  constructor(err: any) {
    const status = err.response?.status;
    const statusText = err.statusText || err.message;
    const detail = err.response?.data?.detail;

    super({
      cause: err,
      code: 'NETBOX_API_ERROR',
      endpoint: err.config?.url,
      status,
      statusText: statusText + (detail ? ` (detail=${detail})` : ''),
      fatal: false,
    });

    if (detail) this.detail = detail;
  }
}

async function withApiErrorHandler<T>(fn: () => Promise<T>): Promise<T> {
  try {
    const response = await fn();
    return response;
  } catch (err) {
    throw new NetboxRequestError(err);
  }
}

export class NetboxClient {
  private readonly host: string;
  private readonly apiKey: string;

  constructor({ host, apiKey }: NetboxClientParams) {
    this.host = host;
    this.apiKey = apiKey;
  }

  async status() {
    const response = await this.get<any>(
      buildApiUrl(this.host, '/api/status/'),
    );

    return response.data;
  }

  async iterateDevices(cb: (device: any) => Promise<void>) {
    await this.paginatedGet('/api/dcim/devices/', cb);
  }

  async paginatedGet<TItem = any>(
    endpoint: string,
    onPageItems: (items: TItem) => Promise<void>,
  ) {
    let next: string | undefined | null;

    do {
      const response = await this.get<TItem>(
        next || buildApiUrl(this.host, endpoint),
      );

      for (const result of response.data.results) {
        await onPageItems(result);
      }

      next = response.data.next;
    } while (next);
  }

  async get<TItem>(url: string) {
    return withApiErrorHandler(() => {
      return axios.get<NetboxApiResponse<TItem>>(url, {
        headers: {
          Authorization: `Token ${this.apiKey}`,
          Accept: 'application/json',
        },
      });
    });
  }
}
