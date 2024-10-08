import { Metadata } from 'next';

import { DetailCredential } from './content';

export const metadata: Metadata = {
  title: 'Credential Details | SunID',
  description: 'Credential Details',
};

const Page: TNextPage<{ credential_id: string }> = async ({ params: { credential_id } }) => {
  return <DetailCredential credentialId={credential_id} />;
};

export default Page;
