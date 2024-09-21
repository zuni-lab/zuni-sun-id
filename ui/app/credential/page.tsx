import { RouterMeta } from '@/constants/router';
import { Metadata } from 'next';
import { CredentialList } from './CredentialList';

export const metadata: Metadata = RouterMeta.Schema;

export default function Page() {
  return (
    <main className="py-16">
      <CredentialList />
    </main>
  );
}
