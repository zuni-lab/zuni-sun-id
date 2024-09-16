import { Metadata } from 'next';
import { DetailSchema } from './content';

export const metadata: Metadata = {
  title: 'All Schemas | SunID',
  description: 'All Schemas of SunID',
};

const Page: TNextPage<{ schema_id: string }> = async ({ params: { schema_id } }) => {
  return <DetailSchema schemaId={schema_id} />;
};

export default Page;
