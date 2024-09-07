'use client';

import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useWalletModal } from '@tronweb3/tronwallet-adapter-react-ui';
import { TronWeb } from '@tronweb3/tronwallet-adapters';

const abi = [
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

type TronWebWithExt = TronWeb & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contract: any;
};

export const ConnectButton: IComponent = () => {
  const { address, connected, wallet, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleRegister = async () => {
    if (connected && window.tronWeb) {
      console.log('called');
      const events = await (window.tronWeb as TronWebWithExt).event.getEventsByTransactionID(
        '97039890e29f2b1dad110e283a59c39c712a1ca902ca687ae29c6b0f1580fbd2',
        { only_confirmed: true }
      );
      console.log(events);

      const contract = await (window.tronWeb as TronWebWithExt).contract(
        abi,
        'TG7ZW9xPDU4FoHdJJfQgs9zoX72ThukLZz'
      );
      const data = await contract
        .getSchema('0x2b4fb0af6589cfbdc945e6a9b293f83be66b5d01b19bb9f37b75bb5564c8c164')
        .call();
      console.log(data);
      const tx = await contract.register([], 'TLY4qnH7TaLRVrmXdwFKUzs2BR9pxuTPXZ', false).send();
      console.log(tx);
    }
  };

  return (
    <div>
      {connected ? (
        <div>
          <div>
            <h2>Wallet Connection Info</h2>
            <p>
              <span>Your selected Wallet:</span> {wallet?.adapter.name}
            </p>
            <p>
              <span>Your Address:</span> {address}
            </p>
            <button onClick={disconnect}>Disconnect Wallet</button>
          </div>
          <div>
            <button onClick={handleRegister}>Register</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setVisible(true)}>Connect Wallet</button>
      )}
    </div>
  );
};
