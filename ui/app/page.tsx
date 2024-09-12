import { ClaimRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { buttonVariants } from '@/components/shadcn/Button';
import { MOCK_CLAIMS, MOCK_STATS } from '@/constants/mock';
import { AppRouter, RouterMeta } from '@/constants/router';
import { Metadata } from 'next';
import Link from 'next/link';
import { RecentSchemas } from './RecentSchemas';
import { TableHeaders } from './schema/config';

export const metadata: Metadata = RouterMeta.Home;

export default function Page() {
  return (
    <main className="py-12 space-y-4">
      <section className="flex items-center gap-12">
        <div>
          <h1>Stats</h1>
        </div>
        <div className="grow flex items-center justify-around gap-4 divide-x divide-white">
          {MOCK_STATS.map((stat, i) => (
            <div className="px-4" key={i}>
              {stat}
            </div>
          ))}
        </div>
        <Link className={buttonVariants()} href={`${AppRouter.Claim}/create`}>
          Make claim
        </Link>
      </section>
      <SunTable
        title="Recent Claims"
        columns={TableHeaders}
        items={MOCK_CLAIMS}
        renderRow={ClaimRow}
        footerButton={
          <Link
            className={buttonVariants({
              variant: 'link',
              className: 'w-full',
            })}
            href={AppRouter.Claim}>
            View all claims
          </Link>
        }
      />

      <RecentSchemas />
    </main>
  );
}
