export const ABI = [
  {
    inputs: [],
    name: 'AlreadyExists',
    type: 'error',
  },
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
        indexed: true,
        internalType: 'address',
        name: 'registerer',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'uid',
            type: 'bytes32',
          },
          {
            internalType: 'contract ISchemaResolver',
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
        indexed: false,
        internalType: 'struct SchemaRecord',
        name: 'schema',
        type: 'tuple',
      },
    ],
    name: 'Registered',
    type: 'event',
    stateMutability: 'nonpayable',
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
            internalType: 'contract ISchemaResolver',
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
        internalType: 'contract ISchemaResolver',
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
];
