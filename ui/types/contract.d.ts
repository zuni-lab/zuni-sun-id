type GeneralUIDEvent = {
  uid: string;
};

type RegisterSchemaEvent = GeneralUIDEvent & {
  registerer: THexString;
};

type IssueCredentialEvent = GeneralUIDEvent & {
  recipient: THexString;
  issuer: THexString;
  schemaUID: string;
};

type SchemaData = {
  id: number;
  uid: string;
  name: string;
  resolver: THexString;
  revocable: boolean;
  definition: TSchemaDefinitions;
  timestamp: number;
};

type QueryCombinedDataResult = CredentialType | 'schema' | 'address' | 'none';

type TxResultType =
  | 'RegisterSchema'
  | 'IssueCredential'
  | 'RevokeCredential'
  | 'IssueCredentialOffchain';
