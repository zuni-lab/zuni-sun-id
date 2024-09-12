import { SchemaKeys } from '@/app/schema/config';
import { SCHEMA_REGISTRY_ABI } from '@/constants/abi';
import { TronContract } from '@/tron/contract';
import { EventQuery } from '@/tron/events';
import { ProjectENV } from '@env';
import { useQuery } from '@tanstack/react-query';

const useSchemas = ({ page, limit }: { page: number; limit: number }) => {
  const { data: events, isLoading: isEventLoading } = useQuery({
    queryKey: [SchemaKeys.Event],
    queryFn: async () => {
      return await EventQuery.getEventsByContractAddress<RegisterSchemaEvent>(
        ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS,
        {
          page, // Assuming currentPage is 1 for simplicity
          size: limit,
        }
      );
    },
  });

  const { data: items, isLoading: isFetching } = useQuery({
    queryKey: [SchemaKeys.Schema, limit],
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

      const result = (await contract.call({
        method: 'getSchemas',
        args: [schemas],
      })) as unknown as SchemaData[];

      return result.map((r, index) => {
        return {
          uid: r.uid,
          resolver: r.resolver,
          revocable: r.revocable,
          schema: r.schema.map((field) => ({
            fieldType: field.fieldType,
            fieldName: field.fieldName,
            fieldDescription: field.fieldDescription,
          })),
          timestamp: timestamps[index] / 1000,
        };
      });
    },
    enabled: !!events && events.length > 0,
  });

  return {
    items,
    isFetching: isFetching || isEventLoading,
  };
};

export default useSchemas;
