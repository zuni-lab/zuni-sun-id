type RegisterSchemaEvent = {
  uid: string;
  registerer: string;
};

type SchemaData = {
  uid: string;
  resolver: string;
  revocable: boolean;
  schema: {
    fieldType: string;
    fieldName: string;
    fieldDescription: string;
  }[];
  timestamp: number;
};
