import { ClaimRow, SchemaRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { buttonVariants } from '@/components/shadcn/Button';
import { MOCK_CLAIMS, MOCK_PRESENTABLE_SCHEMA, MOCK_STATS } from '@/constants/mock';
import { AppRouter, RouterMeta } from '@/constants/router';
import { Metadata } from 'next';
import Link from 'next/link';

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
        columns={[
          { label: 'UUID', className: 'w-40' },
          { label: 'Schema', className: '' },
          { label: 'From', className: 'w-80' },
          { label: 'To', className: 'w-80' },
          { label: 'Type', className: '' },
          { label: 'Time', className: '' },
        ]}
        items={MOCK_CLAIMS}
        renderRow={ClaimRow}
        footerButton="View all claims"
      />
      <SunTable
        title="Recent Schemas"
        columns={[
          { label: '#', className: '' },
          { label: 'UUID', className: 'w-40' },
          { label: 'Schema', className: '' },
          { label: 'Resolver Address', className: '' },
          { label: 'Claims', className: '' },
        ]}
        items={MOCK_PRESENTABLE_SCHEMA}
        renderRow={SchemaRow}
        renderRightTop={
          <Link className={buttonVariants()} href={`${AppRouter.Schema}/create`}>
            Create schema
          </Link>
        }
        footerButton="View all schemas"
      />
    </main>
  );
}
