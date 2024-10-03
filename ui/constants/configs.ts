import { Network, NetworkType } from '@tronweb3/tronwallet-abstract-adapter';

export const APP_NAME = 'SunID';

export type TAPP_NAME = 'SunID';

export const ITEMS_PER_PAGE = {
  CREDENTIAL: 15,
  SCHEMA: 15,
  HOME: 10,
};

export const QueryKeys = {
  Schema: {
    Event: 'schema-event',
    List: 'schema-list',
    Detail: 'schema-detail',
    Total: 'schema-total',
    Credentials: 'schema-credentials',
  },
  Credential: {
    Total: 'credential-total',
    List: 'credential-list',
    Detail: 'credential-detail',
    Address: 'credential-address',
    TotalAddress: 'credential-total-address',
  },
  CombinedData: {
    List: 'combined-data-list',
  },
};

export type TSupportedNetworks = NetworkType.Mainnet | NetworkType.Shasta;
export const SupportedNetworks: TSupportedNetworks[] = [NetworkType.Mainnet, NetworkType.Shasta];

// src/config/networks.js
export const tronNetworks: Record<TSupportedNetworks, Network> = {
  Mainnet: {
    chainId: '0x2b6653dc',
    networkType: NetworkType.Mainnet,
    fullNode: 'https://api.trongrid.io',
    solidityNode: 'https://api.trongrid.io',
    eventServer: 'https://api.trongrid.io',
  },
  Shasta: {
    chainId: '0x94a9059e',
    networkType: NetworkType.Shasta,
    fullNode: 'https://api.shasta.trongrid.io',
    solidityNode: 'https://api.shasta.trongrid.io',
    eventServer: 'https://api.shasta.trongrid.io',
  },
};
