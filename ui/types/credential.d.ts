type TCredential = {
  uid: string;
  issuer: string;
  signature: string;
  schemaUID: string;
  recipient: string;
  expiration: number;
  revocable: boolean;
  refUID: string;
  data: string;
  createdAt: number;
};
