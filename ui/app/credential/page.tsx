import { Metadata } from 'next';

import { RouterMeta } from '@/constants/router';

import { Credentials } from './CredentialsList';

export const metadata: Metadata = RouterMeta.Credentials;

export default function Page() {
  return (
    <main className="py-16">
      <div className="space-y-8">
        <Credentials title="Onchain Credentials" credentialType="onchain" />
        <Credentials title="Offchain Credentials" credentialType="offchain" />
      </div>
    </main>
  );
}
