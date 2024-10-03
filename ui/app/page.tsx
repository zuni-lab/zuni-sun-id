import { RouterMeta } from '@/constants/router';
import { Metadata } from 'next';
import { Credentials } from './components/Credentials';
import { RecentSchemas } from './components/RecentSchemas';
import { Statistics } from './components/Statistics';

export const metadata: Metadata = RouterMeta.Home;

export default function Page() {
  return (
    <main className="py-12 space-y-20">
      <Statistics />
      <Credentials title="Recent Onchain Credentials" credentialType="onchain" />
      <Credentials title="Recent Offchain Credentials" credentialType="offchain" />
      <RecentSchemas />
    </main>
  );
}
