import { useTron } from '@/components/TronProvider';
import { SCHEMA_REGISTRY_ABI, SUN_ID_ABI } from '@/constants/abi';
import { TronContract } from '@/tron/contract';
import { CredentialSignedTypes } from '@/tron/helper';
import { TronWebWithExt } from '@/types/tronWeb';
import { ProjectENV } from '@env';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useSchemaContract = () => {
  return useQuery({
    queryKey: ['schemaContract'],
    queryFn: async () => {
      if (!window.tronLink) {
        throw new Error('TronLink is not found');
      }

      return await TronContract.new(
        window.tronLink.tronWeb as TronWebWithExt,
        SCHEMA_REGISTRY_ABI,
        ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS as TTronAddress
      );
    },
  });
};

export const useCredentialContract = () => {
  return useQuery({
    queryKey: ['credentialContract'],
    queryFn: async () => {
      if (!window.tronLink) {
        throw new Error('TronLink is not found');
      }

      return TronContract.new(
        window.tronLink!.tronWeb as TronWebWithExt,
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
