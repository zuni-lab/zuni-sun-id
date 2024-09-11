export const SCHEMA_REGISTRY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'uid',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'registerer',
        type: 'address',
      },
    ],
    name: 'Registered',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'uid',
        type: 'bytes32',
      },
    ],
    name: 'getSchema',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'uid',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'resolver',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'revocable',
            type: 'bool',
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'fieldType',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'fieldName',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'fieldDescription',
                type: 'string',
              },
            ],
            internalType: 'struct SchemaField[]',
            name: 'schema',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct SchemaRecord',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32[]',
        name: 'uids',
        type: 'bytes32[]',
      },
    ],
    name: 'getSchemas',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'uid',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'resolver',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'revocable',
            type: 'bool',
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'fieldType',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'fieldName',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'fieldDescription',
                type: 'string',
              },
            ],
            internalType: 'struct SchemaField[]',
            name: 'schema',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct SchemaRecord[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'fieldType',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'fieldName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'fieldDescription',
            type: 'string',
          },
        ],
        internalType: 'struct SchemaField[]',
        name: 'schema',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: 'resolver',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'revocable',
        type: 'bool',
      },
    ],
    name: 'register',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
