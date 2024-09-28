export const checkProvider = (key: string, document: Window) => {
  if (typeof document == 'undefined' || !document[key as keyof Window]) {
    throw new Error(`${key} is not found in the document`);
  }
};

export const CredentialSignedTypes = {
  IssueCredential: [
    { name: 'schemaUID', type: 'bytes32' },
    { name: 'recipient', type: 'address' },
    { name: 'expirationTime', type: 'uint64' },
    { name: 'revocable', type: 'bool' },
    { name: 'refUID', type: 'bytes32' },
    { name: 'data', type: 'bytes' },
  ],
};
