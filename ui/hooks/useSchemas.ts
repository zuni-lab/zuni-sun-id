import { SCHEMA_REGISTRY_ABI } from '@/constants/abi';
import { QueryKeys } from '@/constants/configs';
import { TronContract } from '@/tron/contract';
// import { EventQuery } from '@/tron/events';
import { ProjectENV } from '@env';
import { useEffect } from 'react';
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
  const { data: totalSchemas } = useCountSchemas();

  // const { data: events, isLoading: isEventLoading } = useQuery({
  //   queryKey: [QueryKeys.Event],
  //   queryFn: async () => {
  //     return await EventQuery.getEventsByContractAddress<RegisterSchemaEvent>(
  //       ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS,
  //       {
  //         page: 2, // Assuming currentPage is 1 for simplicity
  //         size: limit,
  //       }
  //     );
  //   },
  //   refetchOnMount: true,
  //   refetchInterval: 3000,
  // });

  const {
    data: items,
    isLoading: isFetching,
    refetch: refetchSchemas,
  } = useQuery({
    queryKey: [QueryKeys.Schema, page],
    queryFn: async () => {
      if (!totalSchemas) {
        return [];
      }

      const contract = await getchemaContract();

      let from = totalSchemas - page * limit - 1;
      let to = from + limit;
      if (from < 0) {
        from = 0;
        to = totalSchemas;
      }

      const [result] = await contract.call({
        method: 'getSchemasInRange',
        args: [BigInt(from), BigInt(to)],
      });

      return result.toReversed().map((r) => {
        return {
          uid: r.uid,
          name: r.name,
          resolver: r.resolver,
          revocable: r.revocable,
          schema: r.schema.map((field) => ({
            fieldType: field.fieldType,
            fieldName: field.fieldName,
            fieldDescription: field.fieldDescription,
          })),
          // timestamp: timestamps[index] / 1000,
          timestamp: 10000000,
        };
      });
    },
    // refetchInterval: 2000,
    // refetchOnMount: true,
    // enabled: !!events && events.length > 0,
  });

  useEffect(() => {
    if (totalSchemas) {
      refetchSchemas();
    }
  }, [totalSchemas, refetchSchemas]);

  return {
    items,
    isFetching: isFetching,
  };
};

export const useCountSchemas = () => {
  const { data, refetch } = useQuery({
    queryKey: [QueryKeys.TotalSchema],
    queryFn: async () => {
      const contract = await getchemaContract();
      const [result] = await contract.call({
        method: 'totalSchemas',
        args: [],
      });
      return result;
    },
    refetchInterval: 10_000,
    refetchOnMount: true,
  });

  return { data: parseInt((data as any)?._hex, 16), refetch };
};

export default useSchemas;
