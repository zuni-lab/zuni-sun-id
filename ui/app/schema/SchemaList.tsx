'use client';

import { SchemaRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { SCHEMA_REGISTRY_ABI } from '@/constants/abi';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import { TronContract } from '@/tron/contract';
import { EventQuery } from '@/tron/events';
import { ProjectENV } from '@env';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const SchemaList: IComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: events, isLoading: isEventLoading } = useQuery({
    queryKey: ['schemasEvent'],
    queryFn: async () => {
      return await EventQuery.getEventsByContractAddress<RegisterSchemaEvent>(
        ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS,
        {
          page: currentPage,
          size: ITEMS_PER_PAGE.SCHEMA, // default 20, max 200
        }
      );
    },
  });

  const { data: items, isLoading: isFetching } = useQuery({
    queryKey: ['schemas'],
    queryFn: async () => {
      if (!events) {
        return [];
      }

      const contract = await TronContract.new(
        SCHEMA_REGISTRY_ABI,
        ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS as TTronAddress
      );

      const schemas: THexString[] = [];
      const timestamps: number[] = [];

      for (const event of events) {
        schemas.push(('0x' + event.result.uid) as THexString);
        timestamps.push(event.timestamp);
      }

      console.log({ schemas });

      // const result = await contract.call({
      //   method: 'getSchemas',
      //   args: [schemas],
      // });

      const result = await contract.call({
        method: 'getSchemas',
        args: [
          ['0xe8c645a940d47f080c4ee2f3b2b9e4ea0903db60a4155a654ddedec8081dc45f'] as THexString[],
        ],
      });

      console.log({ result });

      // return result[0].map((s, index) => ({
      //   uid: s.uid,
      //   resolver: s.resolver,
      //   revocable: s.revocable,
      //   schema: s.schema.map((field) => ({
      //     fieldType: field.fieldType,
      //     fieldName: field.fieldName,
      //     fieldDescription: field.fieldDescription,
      //   })),
      //   timestamp: timestamps[index],
      // }));
    },
    enabled: !!events && events.length > 0,
  });

  console.log({ items });

  return (
    <SunTable
      title="List of schemas"
      columns={[
        { label: 'UUID', className: 'w-40' },
        { label: 'Schema', className: '' },
        { label: 'Revocable', className: '' },
        { label: 'Resolver', className: '' },
        { label: 'Claims', className: '' },
        { label: 'Time', className: 'w-40' },
      ]}
      items={items ?? []}
      isLoading={isFetching || isEventLoading}
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
