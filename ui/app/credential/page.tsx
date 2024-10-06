import { Metadata } from 'next';

import { RouterMeta } from '@/constants/router';

import { Credentials } from '../components/Credentials';

export const metadata: Metadata = RouterMeta.Credentials;

export default function Page() {
  return (
    <main className="py-16">
      <div className="flex flex-col gap-8">
        <Credentials title="Onchain Credentials" credentialType="onchain" />
        <Credentials title="Offchain Credentials" credentialType="offchain" />
      </div>
    </main>
  );
}
