import { Metadata } from 'next';

import { RouterMeta } from '@/constants/router';

import { RecentCredentials } from './components/Credentials';
import { RecentSchemas } from './components/RecentSchemas';
import { Statistics } from './components/Statistics';

export const metadata: Metadata = RouterMeta.Home;

export default function Page() {
  return (
    <main className="py-12 space-y-20">
      <Statistics />
      <RecentCredentials title="Recent Onchain Credentials" credentialType="onchain" />
      <RecentCredentials title="Recent Offchain Credentials" credentialType="offchain" />
      <RecentSchemas />
    </main>
  );
}
