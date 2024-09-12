'use client';

import { SchemaRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import useSchemas from '@/hooks/useSchemas';
import { useState } from 'react';
import { TableHeaders } from './config';

export const SchemaList: IComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { items, isFetching } = useSchemas({
    page: currentPage,
    limit: ITEMS_PER_PAGE.SCHEMA,
  });
  return (
    <SunTable
      title="List of schemas"
      columns={TableHeaders}
      items={items ?? []}
      isLoading={isFetching}
      renderRow={SchemaRow}
      maxItems={ITEMS_PER_PAGE.SCHEMA}
      pagination={{
        currentPage: currentPage,
        totalItems: items?.length ?? 0,
        onPageChange: (page) => setCurrentPage(page),
      }}
    />
  );
};
