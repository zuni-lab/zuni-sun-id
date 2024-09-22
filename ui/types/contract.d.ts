type RegisterSchemaEvent = {
  uid: string;
  registerer: string;
};

type IssueCredentialEvent = {
  recipient: string;
  issuer: string;
  uid: string;
  schemaUID: string;
};

type SchemaData = {
  id: number;
  uid: string;
  name: string;
  resolver: string;
  revocable: boolean;
  definition: TSchemaDefinitions;
  timestamp: number;
};

type QueryCombinedDataType = 'onchain-credential' | 'offchain-credential' | 'schema' | 'address';

type QueryCombinedDataResult = {
  result: string;
  type: QueryCombinedDataType;
};
