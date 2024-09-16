import { SCHEMA_REGISTRY_ABI } from '@/constants/abi';
import { QueryKeys } from '@/constants/configs';
import { getchemaContract, TronContract } from '@/tron/contract';
import { EventQuery } from '@/tron/query';
import { hexToNumber } from '@/utils/tools';
import { ProjectENV } from '@env';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

let schemaContract: TronContract<typeof SCHEMA_REGISTRY_ABI> | null = null;

export const getSchemaContract = async () => {
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

  const {
    data: items,
    isLoading: isFetching,
    refetch: refetchSchemas,
  } = useQuery({
    queryKey: [QueryKeys.Schema.List, page],
    queryFn: async () => {
      const contract = await getSchemaContract();

      const to = totalSchemas - (page - 1) * limit;
      let from = to - limit;
      if (from < 0) {
        from = 0;
      }

      const [result] = await contract.call({
        method: 'getSchemasInRange',
        args: [BigInt(from), BigInt(to)],
      });

      return result.toReversed().map((r) => {
        const definition = r.schema.split(',').map((field) => {
          const [fieldType, fieldName] = field.split(' ');
          return { fieldType, fieldName };
        });

        return {
          uid: r.uid,
          name: r.name,
          resolver: r.resolver,
          revocable: r.revocable,
          definition,
        } as SchemaData;
      });
    },
    enabled: !!totalSchemas,
  });

  useEffect(() => {
    if (totalSchemas) {
      refetchSchemas();
    }
  }, [totalSchemas, refetchSchemas]);

  return {
    items,
    total: totalSchemas,
    isFetching: isFetching,
  };
};

export const useCountSchemas = () => {
  const { data, refetch } = useQuery({
    queryKey: [QueryKeys.Schema.Total],
    queryFn: async () => {
      const contract = await getSchemaContract();
      const [result] = await contract.call({
        method: 'totalSchemas',
        args: [],
      });
      return result;
    },
    refetchInterval: 5000,
    refetchOnMount: true,
  });

  return { data: hexToNumber(data), refetch };
};

export const useDetailSchema = (schemaId: THexString) => {
  return useQuery({
    queryKey: [QueryKeys.Schema, schemaId],
    queryFn: async () => {
      const contract = await getchemaContract();
      const [result] = await contract.call({
        method: 'getSchema',
        args: [schemaId],
      });

      const definition = result.schema.split(',').map((field) => {
        const [fieldType, fieldName] = field.split(' ');
        return { fieldType, fieldName };
      });

      const schemaEvents = await EventQuery.getEventsByContractAddress<RegisterSchemaEvent>(
        ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS as TTronAddress
      );
      const schemaEvent = schemaEvents.find((e) => e.result.uid === schemaId.slice(2));

      return {
        id: Number(result.id),
        tx: schemaEvent?.transaction,
        creator: schemaEvent?.result.registerer,
        uid: result.uid,
        name: result.name,
        resolver: result.resolver,
        revocable: result.revocable,
        definition,
        timestamp: schemaEvent?.timestamp || 0,
      };
    },
  });
};

export default useSchemas;
