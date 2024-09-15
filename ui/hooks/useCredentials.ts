import { SUN_ID_ABI } from '@/constants/abi';
import { QueryKeys } from '@/constants/configs';
import { TronContract } from '@/tron/contract';
import { ProjectENV } from '@env';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hexToNumber } from '@/utils/tools';
import { getSchemaContract } from './useSchemas';

let sunIdContract: TronContract<typeof SUN_ID_ABI> | null = null;

export const getSunIdContract = async () => {
  if (!sunIdContract) {
    sunIdContract = await TronContract.new(
      SUN_ID_ABI,
      ProjectENV.NEXT_PUBLIC_SUN_ID_ADDRESS as TTronAddress
    );
  }

  return sunIdContract;
};

const useCredentials = ({ page, limit }: { page: number; limit: number }) => {
  const { data: totalCredentials } = useCountCredentials();

  const {
    data: items,
    isLoading: isFetching,
    refetch: refetchSchemas,
  } = useQuery({
    queryKey: [QueryKeys.Schema, page],
    queryFn: async () => {
      if (!totalCredentials) {
        return [];
      }

      const schemaRegistry = await getSchemaContract();
      const sunId = await getSunIdContract();

      let from = totalCredentials - page * limit;
      const to = from + limit;
      if (from < 0) {
        from = 0;
      }

      const [credentials] = await sunId.call({
        method: 'getCredentialsInRange',
        args: [BigInt(from), BigInt(to)],
      });

      const schemaUIDs = credentials.map((c) => c.schema);
      const [schemas] = await schemaRegistry.call({
        method: 'getSchemas',
        args: [schemaUIDs],
      });
      console.log('data', credentials, schemas);

      return credentials.toReversed().map((c, idx) => {
        return {
          uid: c.uid,
          schema: {
            id: hexToNumber(schemas[idx].id),
            name: schemas[idx].name,
          },
          issuer: c.issuer,
          recipient: c.recipient,
          time: hexToNumber(c.time),
          type: 'onchain',
        };
      });
    },
  });

  useEffect(() => {
    if (totalCredentials) {
      refetchSchemas();
    }
  }, [totalCredentials, refetchSchemas]);

  return {
    items,
    isFetching: isFetching,
  };
};

export const useCountCredentials = () => {
  const { data, refetch } = useQuery({
    queryKey: [QueryKeys.Credential.Total],
    queryFn: async () => {
      const contract = await getSunIdContract();
      const [result] = await contract.call({
        method: 'totalCredentials',
        args: [],
      });
      return result;
    },
    refetchInterval: 10_000,
    refetchOnMount: true,
  });

  return { data: hexToNumber(data), refetch };
};

export default useCredentials;
