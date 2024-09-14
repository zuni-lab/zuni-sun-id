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
        indexed: true,
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
            internalType: 'string',
            name: 'name',
            type: 'string',
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
            internalType: 'string',
            name: 'name',
            type: 'string',
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
        internalType: 'uint256',
        name: 'from',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'to',
        type: 'uint256',
      },
    ],
    name: 'getSchemasInRange',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'uid',
            type: 'bytes32',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
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
        internalType: 'string',
        name: 'name',
        type: 'string',
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
  {
    inputs: [],
    name: 'totalSchemas',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const SUN_ID_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'issuer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'uid',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'schemaUID',
        type: 'bytes32',
      },
    ],
    name: 'Issued',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'issuer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'uid',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'schemaUID',
        type: 'bytes32',
      },
    ],
    name: 'Revoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'revoker',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'data',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'uint64',
        name: 'timestamp',
        type: 'uint64',
      },
    ],
    name: 'RevokedOffchain',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'data',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'uint64',
        name: 'timestamp',
        type: 'uint64',
      },
    ],
    name: 'Timestamped',
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
    name: 'getCredential',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'uid',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'schema',
            type: 'bytes32',
          },
          {
            internalType: 'uint64',
            name: 'time',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'expirationTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'revocationTime',
            type: 'uint64',
          },
          {
            internalType: 'bytes32',
            name: 'refUID',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'issuer',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'revocable',
            type: 'bool',
          },
          {
            internalType: 'bytes[]',
            name: 'data',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct Credential',
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
        name: 'uid',
        type: 'bytes32[]',
      },
    ],
    name: 'getCredentials',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'uid',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'schema',
            type: 'bytes32',
          },
          {
            internalType: 'uint64',
            name: 'time',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'expirationTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'revocationTime',
            type: 'uint64',
          },
          {
            internalType: 'bytes32',
            name: 'refUID',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'issuer',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'revocable',
            type: 'bool',
          },
          {
            internalType: 'bytes[]',
            name: 'data',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct Credential[]',
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
        internalType: 'uint256',
        name: 'from',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'to',
        type: 'uint256',
      },
    ],
    name: 'getCredentialsInRange',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'uid',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'schema',
            type: 'bytes32',
          },
          {
            internalType: 'uint64',
            name: 'time',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'expirationTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'revocationTime',
            type: 'uint64',
          },
          {
            internalType: 'bytes32',
            name: 'refUID',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'issuer',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'revocable',
            type: 'bool',
          },
          {
            internalType: 'bytes[]',
            name: 'data',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct Credential[]',
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
        internalType: 'address',
        name: 'revoker',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'data',
        type: 'bytes32',
      },
    ],
    name: 'getRevokeOffchain',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSchemaRegistry',
    outputs: [
      {
        internalType: 'contract ISchemaRegistry',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'uid',
        type: 'bytes32',
      },
    ],
    name: 'isCredentialValid',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
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
            internalType: 'bytes32',
            name: 'schemaUID',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'expirationTime',
            type: 'uint64',
          },
          {
            internalType: 'bool',
            name: 'revocable',
            type: 'bool',
          },
          {
            internalType: 'bytes32',
            name: 'refUID',
            type: 'bytes32',
          },
          {
            internalType: 'bytes[]',
            name: 'data',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct CredentialRequest',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'issue',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'schemaUID',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'credentialUID',
            type: 'bytes32',
          },
        ],
        internalType: 'struct RevocationRequest',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'revoke',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'uid',
        type: 'bytes32',
      },
    ],
    name: 'revokeOffchain',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalCredentials',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
