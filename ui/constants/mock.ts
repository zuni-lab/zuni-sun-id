import { ProjectENV } from '@env';

export const MOCK_STATS = [
  'Total Claim: 1,000,000',
  'Total Schema: 1,000',
  'Verified Claim: 1,000',
];

export const MOCK_RESOLVER_ADDRESS = ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS;

export const MOCK_PRESENTABLE_SCHEMA: TPresentableSchema[] = [
  {
    id: 1,
    uuid: '0x123',
    schema: [
      {
        token: 'name',
        type: 'string',
      },
      {
        token: 'age',
        type: 'uint8',
      },
      {
        token: 'address',
        type: 'address',
      },
    ],
    resolverAddresss: '0x000',
    numberOfClaims: 100,
  },
  {
    id: 2,
    uuid: '0x456',
    schema: [
      {
        token: 'name',
        type: 'string',
      },
      {
        token: 'age',
        type: 'uint8',
      },
      {
        token: 'address',
        type: 'address',
      },
    ],
    resolverAddresss: '0x000',
    numberOfClaims: 100,
  },
  {
    id: 3,
    uuid: '0x789',
    schema: [
      {
        token: 'name',
        type: 'string',
      },
      {
        token: 'age',
        type: 'uint8',
      },
      {
        token: 'address',
        type: 'address',
      },
    ],
    resolverAddresss: '0x000',
    numberOfClaims: 100,
  },
  {
    id: 4,
    uuid: '0xabc',
    schema: [
      {
        token: 'name',
        type: 'string',
      },
      {
        token: 'age',
        type: 'uint8',
      },
      {
        token: 'address',
        type: 'address',
      },
    ],
    resolverAddresss: '0x000',
    numberOfClaims: 100,
  },
];

export const MOCK_CLAIMS: TClaim[] = [
  {
    uuid: '0x123',
    schemaId: 1,
    from: '0x000',
    to: '0x111',
    type: 'OFFCHAIN',
    time: 1725774021,
  },

  {
    uuid: '0x456',
    schemaId: 2,
    from: '0x000',
    to: '0x111',
    type: 'OFFCHAIN',
    time: 1725774021,
  },

  {
    uuid: '0x789',
    schemaId: 3,
    from: '0x000',
    to: '0x111',
    type: 'OFFCHAIN',
    time: 1725774021,
  },

  {
    uuid: '0xabc',
    schemaId: 4,
    from: '0x000',
    to: '0x111',
    type: 'OFFCHAIN',
    time: 1725774021,
  },
];
