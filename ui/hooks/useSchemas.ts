import { useTronWeb } from '@/components/TronProvider';
import { QueryKeys } from '@/constants/configs';
import { EventQuery } from '@/tron/query';
import { EMPTY_UID, hexToNumber } from '@/utils/tools';
import { ProjectENV } from '@env';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSchemaContract } from './useContract';

const useSchemas = ({ page, limit }: { page: number; limit: number }) => {
  const { data: totalSchemas } = useCountSchemas();
  const { data: contract } = useSchemaContract();

  const {
    data: items,
    isLoading: isFetching,
    refetch: refetchSchemas,
  } = useQuery({
    queryKey: [QueryKeys.Schema.List, page],
    queryFn: async () => {
      const to = totalSchemas - (page - 1) * limit;
      let from = to - limit;
      if (from < 0) {
        from = 0;
      }

      const [result] = await contract!.call({
        method: 'getSchemasInRange',
        args: [BigInt(from), BigInt(to)],
      });
      return result
        .map((r) => {
          const definition = r.schema.split(',').map((field) => {
            const [fieldType, fieldName] = field.split(' ');
            return { fieldType, fieldName };
          });

          return {
            id: Number(r.id) + 1,
            uid: r.uid,
            name: r.name,
            resolver: r.resolver,
            revocable: r.revocable,
            definition,
          } as SchemaData;
        })
        .toReversed();
    },
    enabled: !!totalSchemas && !!contract,
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
  const { data: contract } = useSchemaContract();
  const { data, refetch } = useQuery({
    queryKey: [QueryKeys.Schema.Total],
    queryFn: async () => {
      console.log('contract', contract);
      const [result] = await contract!.call({
        method: 'totalSchemas',
        args: [],
      });
      return result;
    },
    refetchInterval: 5000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!contract,
  });

  return { data: hexToNumber(data), refetch };
};

export const useDetailSchema = (schemaId: THexString) => {
  const { data: contract } = useSchemaContract();
  const tronWeb = useTronWeb();

  return useQuery({
    queryKey: [QueryKeys.Schema.Detail, schemaId],
    queryFn: async () => {
      const [result] = await contract!.call({
        method: 'getSchema',
        args: [schemaId],
      });

      if (result.uid === EMPTY_UID) {
        return null;
      }

      const definition = result.schema.split(',').map((field) => {
        const [fieldType, fieldName] = field.split(' ');
        return { fieldType, fieldName } as TSchemaDefinition;
      });

      const schemaEvents = await EventQuery.getEventsByContractAddress<RegisterSchemaEvent>(
        tronWeb,
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
    enabled: !!contract,
  });
};

export default useSchemas;
