export const APP_NAME = 'SunID';

export type TAPP_NAME = 'SunID';

export const ITEMS_PER_PAGE = {
  CREDENTIAL: 15,
  SCHEMA: 15,
  HOME: 10,
};

export const QueryKeys = {
  Schema: {
    Event: 'schema-event',
    List: 'schema-list',
    Detail: 'schema-detail',
    Total: 'schema-total',
    Credentials: 'schema-credentials',
  },
  Credential: {
    Total: 'credential-total',
    List: 'credential-list',
    Detail: 'credential-detail',
    Address: 'credential-address',
  },
  CombinedData: {
    List: 'combined-data-list',
  },
};
