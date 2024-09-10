'use client';

import { SchemaRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { SCHEMA_REGISTRY_ABI } from '@/constants/abi';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import { TonContract } from '@/tron/contract';
import { EventQuery } from '@/tron/events';
import { ProjectENV } from '@env';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const SchemaList: IComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: items, isLoading: isFetching } = useQuery({
    queryKey: ['schemas'],
    queryFn: async () => {
      const events = await EventQuery.getEventsByContractAddress<RegisterSchemaEvent>(
        ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS,
        {
          page: currentPage,
          size: ITEMS_PER_PAGE.SCHEMA, // default 20, max 200
        }
      );

      const schemas = events.map((event) => '0x' + event.result.uid);

      const contract = new TonContract(
        SCHEMA_REGISTRY_ABI,
        ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS as TTronAddress
      );

      const schemaCalls = [];
      for (const schema of schemas) {
        const getSchemaCall = contract.call('getSchema', [schema]) as Promise<SchemaData>;
        schemaCalls.push(getSchemaCall);
      }
      return Promise.all(schemaCalls);
    },
  });

  return (
    <SunTable
      title="List of schemas"
      columns={[
        { label: 'UUID', className: 'w-40' },
        { label: 'Schema', className: '' },
        { label: 'Revocable', className: '' },
        { label: 'Resolver', className: '' },
        { label: 'Claims', className: '' },
      ]}
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
