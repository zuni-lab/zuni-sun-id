type RegisterSchemaEvent = {
  uid: string;
  registerer: THexString;
};

type IssueCredentialEvent = {
  recipient: THexString;
  issuer: THexString;
  uid: string;
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
