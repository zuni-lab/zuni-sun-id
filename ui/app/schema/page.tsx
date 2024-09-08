import { buttonVariants } from '@/components/shadcn/Button';
import { MOCK_STATS } from '@/constants/mock';
import { AppRouter, RouterMeta } from '@/constants/router';
import { Metadata } from 'next';
import Link from 'next/link';
import { SchemaList } from './SchemaList';

export const metadata: Metadata = RouterMeta.Schema;

export default function Page() {
  return (
    <main>
      <div className="bg-muted h-60">
        <h1>Build your schema</h1>
      </div>
      <div className="py-12 space-y-4">
        <section className="flex items-center gap-12">
          <div>
            <h1>Schema</h1>
          </div>
          <div className="grow flex items-center justify-around gap-4 divide-x divide-white">
            {MOCK_STATS.map((stat, i) => (
              <div className="px-4" key={i}>
                {stat}
              </div>
            ))}
          </div>
          <Link className={buttonVariants()} href={`${AppRouter.Schema}/create`}>
            Create schema
          </Link>{' '}
        </section>
        <SchemaList />
      </div>
    </main>
  );
}
