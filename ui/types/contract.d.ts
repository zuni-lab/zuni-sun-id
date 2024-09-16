type RegisterSchemaEvent = {
  uid: string;
  registerer: string;
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
