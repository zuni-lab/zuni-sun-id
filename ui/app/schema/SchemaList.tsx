'use client';

import { useState } from 'react';

import { SchemaRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import useSchemas from '@/hooks/useSchemas';

import { SchemaTableHeaders } from '../../constants/table';

export const SchemaList: IComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { items, total, isFetching } = useSchemas({
    page: currentPage,
    limit: ITEMS_PER_PAGE.SCHEMA,
  });

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
        totalItems: total,
        onPageChange: (page) => setCurrentPage(page),
      }}
    />
  );
};
