import { SchemaKeys } from '@/app/schema/config';
import { SCHEMA_REGISTRY_ABI } from '@/constants/abi';
import { TronContract } from '@/tron/contract';
import { EventQuery } from '@/tron/events';
import { ProjectENV } from '@env';
import { useQuery } from '@tanstack/react-query';

let schemaContract: TronContract<typeof SCHEMA_REGISTRY_ABI> | null = null;

const getchemaContract = async () => {
  if (!schemaContract) {
    schemaContract = await TronContract.new(
      SCHEMA_REGISTRY_ABI,
      ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS as TTronAddress
    );
  }

  return schemaContract;
};
const useSchemas = ({ page, limit }: { page: number; limit: number }) => {
  const { data: events, isLoading: isEventLoading } = useQuery({
    queryKey: [SchemaKeys.Event],
    queryFn: async () => {
      return await EventQuery.getEventsByContractAddress<RegisterSchemaEvent>(
        ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS,
        {
          page: 2, // Assuming currentPage is 1 for simplicity
          size: limit,
        }
      );
    },
    refetchOnMount: true,
    refetchInterval: 3000,
  });

  const { data: items, isLoading: isFetching } = useQuery({
    queryKey: [SchemaKeys.Schema, page],
    queryFn: async () => {
      if (!events) {
        return [];
      }

      const contract = await getchemaContract();

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
    refetchInterval: 2000,
    refetchOnMount: true,
    enabled: !!events && events.length > 0,
  });

  return {
    items,
    isFetching: isFetching || isEventLoading,
  };
};

export const useCountSchemas = () => {
  return useQuery({
    queryKey: [SchemaKeys.TotalSchema],
    queryFn: async () => {
      const contract = await getchemaContract();

      return await contract.call({
        method: 'totalSchemas',
        args: [],
      });
    },
    refetchInterval: 2000,
    refetchOnMount: true,
  });
};

export default useSchemas;
