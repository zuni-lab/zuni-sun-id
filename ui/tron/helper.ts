import { TronWebWithExt } from '@/types/tronWeb';
import { ProjectENV } from '@env';

export const checkProvider = (key: string, document: Window) => {
  if (typeof document == 'undefined' || !document[key as keyof Window]) {
    console.log({ key, document });
    throw new Error(`${key} is not found in the document`);
  }
};

export const TronWeb = (): TronWebWithExt => {
  checkProvider('tronWeb', window);
  return window.tronWeb as TronWebWithExt;
};

const signTronData = (contract: string, types: object, values: object) => {
  checkProvider('tronWeb', window);
  return (window.tronWeb as TronWebWithExt).trx._signTypedData(
    {
      name: 'SunID',
      version: '1',
      chainId: '0x2b6653dc',
      verifyingContract: contract,
    },
    types,
    values
  );
};

const CredentialSignedTypes = {
  IssueCredential: [
    { name: 'schemaUID', type: 'bytes32' },
    { name: 'recipient', type: 'address' },
    { name: 'expirationTime', type: 'uint64' },
    { name: 'revocable', type: 'bool' },
    { name: 'refUID', type: 'bytes32' },
    { name: 'data', type: 'bytes' },
  ],
};

export const signCredentialOffChain: (values: object) => Promise<THexString> = async (
  values: object
) => {
  return signTronData(ProjectENV.NEXT_PUBLIC_SUN_ID_ADDRESS, CredentialSignedTypes, values);
};
