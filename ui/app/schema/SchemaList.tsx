'use client';

import { SchemaRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { ITEMS_PER_PAGE } from '@/constants/items';
import { useState } from 'react';

const Data: TPresentableSchema[] = Array.from({ length: 5000 }, (_, i) => {
  return {
    id: i + 1,
    uuid: `0x${i}`,
    schema: [
      {
        token: 'name',
        type: 'string',
      },
      {
        token: 'age',
        type: 'uint8',
      },
      {
        token: 'address',
        type: 'address',
      },
    ],
    resolverAddresss: '0x000',
    numberOfClaims: 100,
  };
});

const fetchItems = (page: number) => {
  return Data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
};

export const SchemaList: IComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const items = fetchItems(currentPage);

  return (
    <SunTable
      title="List of schemas"
      columns={[
        { label: '#', className: '' },
        { label: 'UUID', className: 'w-40' },
        { label: 'Schema', className: '' },
        { label: 'Resolver Address', className: '' },
        { label: 'Claims', className: '' },
      ]}
      items={items}
      isLoading={false}
      renderRow={SchemaRow}
      pagination={{
        currentPage: currentPage,
        totalItems: Data.length,
        onPageChange: (page) => setCurrentPage(page),
      }}
    />
  );
};
