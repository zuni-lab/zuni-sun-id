import { CredentialApi, CredentialResponse } from '@/api/credential';
import { useTronWeb } from '@/components/TronProvider';
import { QueryKeys } from '@/constants/configs';
import { EventQuery } from '@/tron/query';
import { isTronAddress } from '@/utils/tools';
import { ProjectENV } from '@env';
import { useQuery } from '@tanstack/react-query';

const SCHEMA_UID_LENGTH = 66;
const ADDRESS_LENGTH = 34;

export const useCombinedData = ({ query }: { query: string }) => {
  const tronWeb = useTronWeb();

  return useQuery({
    queryKey: [QueryKeys.CombinedData.List],
    queryFn: async (): Promise<QueryCombinedDataResult | null> => {
      if (query.length !== SCHEMA_UID_LENGTH && query.length !== ADDRESS_LENGTH) {
        return null;
      }

      if (query.length === ADDRESS_LENGTH) {
        return isTronAddress(query) ? { result: query, type: 'address' } : null;
      }

      try {
        const { uid } = (await CredentialApi.search({ uid: query })) as CredentialResponse;
        return { result: uid, type: 'offchain' };
      } catch (error) {
        // continue regardless of error
      }

      const schemaEvents = await EventQuery.getEventsByContractAddress<RegisterSchemaEvent>(
        tronWeb,
        ProjectENV.NEXT_PUBLIC_SUN_ID_ADDRESS as TTronAddress
      );
      const schema = schemaEvents.find((e) => e.result.uid === query);
      if (schema) {
        return { result: schema.result.uid, type: 'schema' };
      }

      const sunIdEvents = await EventQuery.getEventsByContractAddress<IssueCredentialEvent>(
        tronWeb,
        ProjectENV.NEXT_PUBLIC_SUN_ID_ADDRESS as TTronAddress
      );
      const onchainCredential = sunIdEvents.find((e) => e.result.uid);
      if (onchainCredential) {
        console.log('found onchain', onchainCredential.result.uid);
        return { result: onchainCredential.result.uid, type: 'onchain' };
      }

      return null;
    },
  });
};
