'use client';

export const IssuePage: IComponent<{
  schemaId: THexString;
}> = ({ schemaId }) => {
  console.log('Use Schema: ', schemaId);

  return <div>Schema: {schemaId}</div>;
};
