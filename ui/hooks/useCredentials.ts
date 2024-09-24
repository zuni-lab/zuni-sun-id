import { useTronWeb } from '@/components/TronProvider';
import { SUN_ID_ABI } from '@/constants/abi';
import { QueryKeys } from '@/constants/configs';
import { TronContract } from '@/tron/contract';
import { EventQuery } from '@/tron/query';
import { hexToNumber, toHexAddress, toTronAddress } from '@/utils/tools';
import { ProjectENV } from '@env';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSchemaContract } from './useContract';
import { CredentialApi } from '@/api/credential';

let sunIdContract: TronContract<typeof SUN_ID_ABI> | null = null;

export const useSundIdContract = () => {
  const tronWeb = useTronWeb();

  return useQuery({
    queryKey: ['sunIdContract'],
    queryFn: async () => {
      if (!sunIdContract) {
        sunIdContract = await TronContract.new(
          tronWeb,
          SUN_ID_ABI,
          ProjectENV.NEXT_PUBLIC_SUN_ID_ADDRESS as TTronAddress
        );
      }

      return sunIdContract;
    },
  });
};

export const useCredentials = ({ page, limit }: { page: number; limit: number }) => {
  const { data: totalCredentials } = useCountCredentials();
  const { data: sunId } = useSundIdContract();
  const { data: schemaRegistry } = useSchemaContract();

  const {
    data: items,
    isLoading: isFetching,
    refetch: refetchSchemas,
  } = useQuery({
    queryKey: [QueryKeys.Credential.List, page],
    queryFn: async () => {
      let from = totalCredentials - page * limit;
      const to = from + limit;
      if (from < 0) {
        from = 0;
      }

      const [credentials] = await sunId!.call({
        method: 'getCredentialsInRange',
        args: [BigInt(from), BigInt(to)],
      });

      const schemaUIDs = credentials.map((c) => c.schema);
      const [schemas] = await schemaRegistry!.call({
        method: 'getSchemas',
        args: [schemaUIDs],
      });

      return credentials.toReversed().map((c, idx) => {
        return {
          uid: c.uid,
          schema: {
            id: hexToNumber(schemas[idx].id),
            name: schemas[idx].name,
          },
          issuer: toTronAddress(c.issuer),
          recipient: toTronAddress(c.recipient),
          timestamp: hexToNumber(c.time),
          type: 'onchain',
        } as TCredential;
      });
    },
    enabled: !!totalCredentials && !!sunId && !!schemaRegistry,
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

export const useCredentialDetail = (credentialId: THexString, onchain = true) => {
  const tronweb = useTronWeb();
  const { data: schemaContract } = useSchemaContract();
  const { data: sunId } = useSundIdContract();

  return useQuery({
    queryKey: [QueryKeys.Credential.Detail, credentialId],
    queryFn: async () => {
      let credential: {
        uid: THexString;
        issuer: string;
        recipient: string;
        revocable: boolean;
        refUID: THexString;
        expirationTime: number;
        revocationTime: number;
        time: number;
        data: THexString;
        schema: THexString;
      };
      if (onchain) {
        const [credentialOnchain] = await sunId!.call({
          method: 'getCredential',
          args: [credentialId],
        });
        credential = {
          ...credentialOnchain,
          expirationTime: Number(credentialOnchain.expirationTime),
          revocationTime: Number(credentialOnchain.revocationTime),
          time: Number(credentialOnchain.time),
        }
      } else {
        const credentialOffchain = await CredentialApi.search({ uid: credentialId });
        credential = {
          ...credentialOffchain,
          refUID: credentialOffchain.ref_uid,
          expirationTime: credentialOffchain.expiration_time,
          revocationTime: 0,
          time: credentialOffchain.created_at,
          schema: credentialOffchain.schema_uid,
        }
      }

        const [schema] = await schemaContract!.call({
          method: 'getSchema',
          args: [credential.schema],
        });

        const definition = schema.schema.split(',').map((field) => {
          const [fieldType, fieldName] = field.split(' ');
          return { fieldType, fieldName } as TSchemaDefinition;
        });

        const dataTypes = definition.map((field) => field.fieldType);
        const dataValues = tronweb.utils.abi.decodeParams(dataTypes, credential.data) as string[];
        const data = dataValues.map((v, i) => {
          return {
            name: definition[i].fieldName,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value: (v as any).toString(),
          };
        });

        return {
          uid: credential.uid,
          issuer: toTronAddress(credential.issuer),
          recipient: toTronAddress(credential.recipient),
          revocable: credential.revocable,
          refUID: credential.refUID,
          data,
          schema: {
            id: Number(schema.id),
            uid: schema.uid,
            name: schema.name,
          },
          timestamp: credential.time * 1000,
          expirationTime: credential.expirationTime * 1000,
          revocationTime: credential.revocationTime * 1000,
          type: 'onchain',
        } as TCredential;
      
    },
    enabled: !!sunId && !!schemaContract,
  });
};

export const useCredentialsBySchema = ({
  page,
  // limit,
  schema,
}: {
  page: number;
  // limit: number;
  schema: string;
}) => {
  const { data: totalCredentials } = useCountCredentials();
  const tronWeb = useTronWeb();

  const {
    data: items,
    isLoading: isFetching,
    refetch: refetchSchemas,
  } = useQuery({
    queryKey: [QueryKeys.Schema.Credentials, schema, page],
    queryFn: async () => {
      const schemaEvents = await EventQuery.getEventsByContractAddress<IssueCredentialEvent>(
        tronWeb,
        ProjectENV.NEXT_PUBLIC_SUN_ID_ADDRESS as TTronAddress
      );
      const issuedCredentialEvents = schemaEvents.filter(
        (e) => e.result.schemaUID === schema.slice(2)
      );

      return issuedCredentialEvents.map((e) => {
        return {
          uid: '0x' + e.result.uid,
          issuer: toTronAddress(e.result.issuer),
          recipient: toTronAddress(e.result.recipient),
          time: e.timestamp / 1000,
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

export const useCredentialsByAddress = ({
  page,
  // limit,
  address,
}: {
  page: number;
  // limit: number;
  address: string;
}) => {
  const tronWeb = useTronWeb();
  return useQuery({
    queryKey: [QueryKeys.Credential.Address, address, page],
    queryFn: async () => {
      const issueCredentailEvents =
        await EventQuery.getEventsByContractAddress<IssueCredentialEvent>(
          tronWeb,
          ProjectENV.NEXT_PUBLIC_SUN_ID_ADDRESS as TTronAddress
        );
      const hexAddress = address.startsWith('0x') ? address : toHexAddress(address);

      let issued = 0;
      let received = 0;

      const issuedCredentialEvents = issueCredentailEvents.filter((e) => {
        if (e.name === 'Issued') {
          if (e.result.issuer === hexAddress) {
            issued++;
            return true;
          } else if (e.result.recipient === hexAddress) {
            received++;
            return true;
          }
        }
        return false;
      });

      const credentials = issuedCredentialEvents.map((e) => {
        return {
          uid: '0x' + e.result.uid,
          issuer: toTronAddress(e.result.issuer),
          recipient: toTronAddress(e.result.recipient),
          time: e.timestamp / 1000,
        };
      });

      return {
        issued,
        received,
        credentials,
      };
    },
  });
};

export const useCountCredentials = () => {
  const { data: contract } = useSundIdContract();

  const { data, refetch } = useQuery({
    queryKey: [QueryKeys.Credential.Total],
    queryFn: async () => {
      const [result] = await contract!.call({
        method: 'totalCredentials',
        args: [],
      });
      return result;
    },
    refetchInterval: 10_000,
    refetchOnMount: true,
    enabled: !!contract,
  });

  return { data: hexToNumber(data), refetch };
};

export default useCredentials;
