type TCredential = {
  uid: THexString;
  issuer: THexString;

  recipient: THexString;
  revocable: boolean;
  refUID: THexString;

  data?: {
    name: string;
    value: string;
  }[];

  signature?: string;

  schema: {
    id?: number;
    uid: THexString;
    name?: string;
  };
  timestamp: number;
  expirationTime?: number;
  revocationTime?: number;

  type: CredentialType;
};

type TQueryCredential = {
  uid: THexString;
  issuer: string;
  recipient: string;
  revocable: boolean;
  refUID: THexString;
  expirationTime: number;
  revocationTime: number;
  time: number;
  data: THexString;
  schema: THexString;
};

type CredentialType = 'onchain' | 'offchain';
