'use client';

import { SchemaRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { buttonVariants } from '@/components/shadcn/Button';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import { AppRouter } from '@/constants/router';
import useSchemas from '@/hooks/useSchemas';
import Link from 'next/link';
import { SchemaTableHeaders } from '../../constants/table';

export const RecentSchemas: IComponent = () => {
  const { items, isFetching } = useSchemas({
    page: 1,
    limit: ITEMS_PER_PAGE.HOME,
  });

  return (
    <SunTable
      title="Recent Schemas"
      columns={SchemaTableHeaders}
      items={items ?? []}
      isLoading={isFetching}
      renderRow={SchemaRow}
      maxItems={ITEMS_PER_PAGE.HOME}
      footerButton={
        <Link
          className={buttonVariants({
            variant: 'link',
            className: 'w-full',
          })}
          href={AppRouter.Schemas}>
          View all schemas
        </Link>
      }
    />
  );
};
