import { Metadata } from 'next';
import { DetailSchema } from './content';

export const metadata: Metadata = {
  title: 'Create Credential With Schema | SunID',
  description: 'Create a new credential with a schema',
};

const Page: TNextPage<{ schema_id: string }> = async ({ params: { schema_id } }) => {
  return <DetailSchema schemaId={schema_id} />;
};

export default Page;
