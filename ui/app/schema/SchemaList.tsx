'use client';

import { SchemaRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import useSchemas, { useCountSchemas } from '@/hooks/useSchemas';
import { useState } from 'react';
import { SchemaTableHeaders } from '../../constants/table';

export const SchemaList: IComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: totalSchema } = useCountSchemas();

  const { items, isFetching } = useSchemas({
    page: currentPage,
    limit: ITEMS_PER_PAGE.SCHEMA,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalItems = parseInt((totalSchema as any)?._hex, 16) ?? (items?.length || 0);

  return (
    <SunTable
      title="List of schemas"
      columns={SchemaTableHeaders}
      items={items ?? []}
      isLoading={isFetching}
      renderRow={SchemaRow}
      maxItems={ITEMS_PER_PAGE.SCHEMA}
      pagination={{
        currentPage: currentPage,
        totalItems: totalItems,
        onPageChange: (page) => setCurrentPage(page),
      }}
    />
  );
};
