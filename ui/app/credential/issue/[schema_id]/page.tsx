import { Metadata } from 'next';
import { IssuePage } from './issue';

export const metadata: Metadata = {
  title: 'Create Credential With Schema | SunID',
  description: 'Create a new credential with a schema',
};

const Page: TNextPage<{ schema_id: string }> = async ({ params: { schema_id } }) => {
  return <IssuePage schemaId={schema_id as THexString} />;
};

export default Page;
