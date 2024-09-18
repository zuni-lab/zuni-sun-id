import { Metadata } from 'next';
import { UserCredentialList } from './content';

export const metadata: Metadata = {
  title: 'Credential List by Address | SunID',
  description: 'Credential List',
};

const Page: TNextPage<{ address: string }> = async ({ params: { address } }) => {
  return <UserCredentialList address={address} />;
};

export default Page;
