import { buttonVariants } from '@/components/shadcn/Button';
import { AppRouter, RouterMeta } from '@/constants/router';
import { Metadata } from 'next';
import Link from 'next/link';
import { CredentialList } from './CredentialList';

export const metadata: Metadata = RouterMeta.Schema;

export default function Page() {
  return (
    <main>
      <div className="bg-muted h-60">
        <h1>Issue new credential</h1>
      </div>
      <div className="py-12 space-y-4">
        <section className="flex items-center gap-12">
          <div>
            <h1>Credential</h1>
          </div>
          {/* <div className="grow flex items-center justify-around gap-4 divide-x divide-white">
            {MOCK_STATS.map((stat, i) => (
              <div className="px-4" key={i}>
                {stat}
              </div>
            ))}
          </div> */}
          <Link className={buttonVariants()} href={`${AppRouter.Credential}/issue`}>
            Issue credential
          </Link>{' '}
        </section>
        <CredentialList />
      </div>
    </main>
  );
}
