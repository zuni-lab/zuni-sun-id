import { Metadata } from 'next';

import { DetailSchema } from './content';

export const metadata: Metadata = {
  title: 'Schema Details | SunID',
  description: 'Schema Details',
};

const Page: TNextPage<{ schema_id: THexString }> = async ({ params: { schema_id } }) => {
  return <DetailSchema schemaId={schema_id} />;
};

export default Page;
