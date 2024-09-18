import { Metadata } from 'next';
import { DetailCredential } from './content';

export const metadata: Metadata = {
  title: 'All Credentials | SunID',
  description: 'All Credentials of SunID',
};

const Page: TNextPage<{ credential_id: string }> = async ({ params: { credential_id } }) => {
  return <DetailCredential credentialId={credential_id} />;
};

export default Page;
