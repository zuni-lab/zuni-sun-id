type TCredential = {
  uid: string;
  issuer: string;

  recipient: string;
  revocable: boolean;
  refUID: string;

  data?: {
    name: string;
    value: string;
  }[];

  signature?: string;

  schema?: {
    id?: number;
    uid: string;
    name?: string;
  };
  timestamp: number;
  expirationTime?: number;
  revocationTime?: number;

  type: 'onchain' | 'offchain';
};
