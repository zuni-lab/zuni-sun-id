import { ProjectENV } from '@env';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useTron, useTronWeb } from '@/components/TronProvider';
import { SCHEMA_REGISTRY_ABI, SUN_ID_ABI } from '@/constants/abi';
import { TronContract } from '@/tron/contract';
import { CredentialSignedTypes } from '@/tron/helper';

export const useSchemaContract = () => {
  const tronWeb = useTronWeb();

  return useQuery({
    queryKey: ['schemaContract'],
    queryFn: async () => {
      return await TronContract.new(
        tronWeb,
        SCHEMA_REGISTRY_ABI,
        ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS as TTronAddress
      );
    },
  });
};

export const useCredentialContract = () => {
  const tronWeb = useTronWeb();

  return useQuery({
    queryKey: ['credentialContract'],
    queryFn: async () => {
      return TronContract.new(
        tronWeb,
        SUN_ID_ABI,
        ProjectENV.NEXT_PUBLIC_SUN_ID_ADDRESS as TTronAddress
      );
    },
  });
};

export const useSignCredentialOffChain = () => {
  const { signTronData } = useTron();

  return useMutation({
    mutationFn: async (values: object) => {
      return signTronData(ProjectENV.NEXT_PUBLIC_SUN_ID_ADDRESS, CredentialSignedTypes, values);
    },
  });
};
