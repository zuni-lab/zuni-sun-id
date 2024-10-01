import { useTronWeb } from '@/components/TronProvider';
import { SUN_ID_ABI } from '@/constants/abi';
import { QueryKeys } from '@/constants/configs';
import { TronContract } from '@/tron/contract';
import { EventQuery } from '@/tron/query';
import { hexToNumber } from '@/utils/tools';
import { ProjectENV } from '@env';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSchemaContract } from './useContract';
import { CredentialApi, CredentialResponse, CredentialsPaginationResponse } from '@/api/credential';

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

export const useCredentials = ({
  page,
  limit,
  credentialType,
}: {
  page: number;
  limit: number;
  credentialType: CredentialType;
}) => {
  const { data: totalCredentials } = useCountCredentials();
  const { data: sunId } = useSundIdContract();
  const { data: schemaRegistry } = useSchemaContract();

  const {
    data: items,
    isLoading: isFetching,
    refetch: refetchSchemas,
  } = useQuery({
    queryKey: [QueryKeys.Credential.List, page, limit, credentialType],
    queryFn: async () => {
      let credentials: TCredential[];
      if (credentialType === 'onchain') {
        let from = totalCredentials - page * limit;
        const to = from + limit;
        if (from < 0) {
          from = 0;
        }

        const [onchainCredentials] = await sunId!.call({
          method: 'getCredentialsInRange',
          args: [BigInt(from), BigInt(to)],
        });

        const schemaUIDs = onchainCredentials.map((c) => c.schema);
        const [schemas] = await schemaRegistry!.call({
          method: 'getSchemas',
          args: [schemaUIDs],
        });
        credentials = onchainCredentials
          .map((c, idx) => {
            return {
              uid: c.uid,
              issuer: c.issuer,
              recipient: c.recipient,
              revocable: c.revocable,
              refUID: c.refUID,
              schema: {
                id: Number(schemas[idx].id) + 1,
                uid: schemas[idx].uid,
                name: schemas[idx].name,
              },
              timestamp: Number(c.time),
              expirationTime: Number(c.expirationTime),
              revocationTime: Number(c.revocationTime),
              type: 'onchain' as CredentialType,
            };
          })
          .toReversed();
      } else {
        const { items: offchainCredentials } = (await CredentialApi.search({
          page,
          limit,
        })) as CredentialsPaginationResponse;
        const schemaUIDs = offchainCredentials.map((c) => c.schema_uid);
        const [schemas] = await schemaRegistry!.call({
          method: 'getSchemas',
          args: [schemaUIDs],
        });
        credentials = offchainCredentials.map((c, idx) => {
          return {
            uid: c.uid,
            issuer: c.issuer,
            recipient: c.recipient,
            revocable: c.revocable,
            refUID: c.ref_uid,
            schema: {
              id: Number(schemas[idx].id) + 1,
              uid: schemas[idx].uid,
              name: schemas[idx].name,
            },
            timestamp: c.created_at,
            expirationTime: c.expiration_time,
            revocationTime: 0, // TODO: revoke offchain
            cid: c.cid,
            type: 'offchain' as CredentialType,
          };
        });
      }

      return credentials;
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

export const useCredentialDetail = (credentialId: THexString, credentialType: CredentialType) => {
  const tronweb = useTronWeb();
  const { data: schemaContract } = useSchemaContract();
  const { data: sunId } = useSundIdContract();

  return useQuery({
    queryKey: [QueryKeys.Credential.Detail, credentialId],
    queryFn: async () => {
      if (!sunId || !schemaContract) {
        return null;
      }

      let credential: TQueryCredential;
      if (credentialType === 'onchain') {
        const [onchainCredential] = await sunId.call({
          method: 'getCredential',
          args: [credentialId],
        });
        credential = {
          ...onchainCredential,
          expirationTime: Number(onchainCredential.expirationTime),
          revocationTime: Number(onchainCredential.revocationTime),
          time: Number(onchainCredential.time),
        };
      } else {
        const offchainCredential = (await CredentialApi.search({
          uid: credentialId,
        })) as CredentialResponse;
        const [revocationTime] = await sunId.call({
          method: 'getRevokeOffchain',
          args: [offchainCredential.issuer, offchainCredential.uid],
        });
        credential = {
          ...offchainCredential,
          refUID: offchainCredential.ref_uid,
          expirationTime: offchainCredential.expiration_time,
          revocationTime: Number(revocationTime),
          time: offchainCredential.created_at,
          schema: offchainCredential.schema_uid,
          cid: offchainCredential.cid,
        };
      }

      const [schema] = await schemaContract.call({
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
        issuer: credential.issuer,
        recipient: credential.recipient,
        revocable: credential.revocable,
        refUID: credential.refUID,
        data,
        schema: {
          id: Number(schema.id) + 1,
          uid: schema.uid,
          name: schema.name,
        },
        timestamp: credential.time * 1000,
        expirationTime: credential.expirationTime * 1000,
        revocationTime: credential.revocationTime * 1000,
        type: credentialType,
        cid: credential.cid,
      } as TCredential;
    },
    enabled: !!sunId && !!schemaContract,
  });
};

export const useCredentialsBySchema = ({
  page,
  limit,
  schema,
  credentialType,
}: {
  page: number;
  limit: number;
  schema: THexString;
  credentialType: CredentialType;
}) => {
  const { data: totalCredentials } = useCountCredentials();
  const tronWeb = useTronWeb();

  const {
    data: items,
    isLoading: isFetching,
    refetch: refetchSchemas,
  } = useQuery({
    queryKey: [QueryKeys.Schema.Credentials, schema, page, limit, credentialType],
    queryFn: async (): Promise<TCredentialItem[]> => {
      if (credentialType === 'onchain') {
        const sunIdEvents = await EventQuery.getEventsByContractAddress<IssueCredentialEvent>(
          tronWeb,
          ProjectENV.NEXT_PUBLIC_SUN_ID_ADDRESS as TTronAddress
        );
        const issuedCredentialEvents = sunIdEvents.filter(
          (e) => e.result.schemaUID === schema.slice(2)
        );

        return issuedCredentialEvents.map((e) => {
          return {
            uid: ('0x' + e.result.uid) as THexString,
            issuer: e.result.issuer,
            recipient: e.result.recipient,
            time: e.timestamp / 1000,
            type: 'onchain' as CredentialType,
          };
        });
      } else {
        const { items } = (await CredentialApi.search({
          page,
          limit,
          schema_uid: schema,
        })) as CredentialsPaginationResponse;
        return items.map((c) => {
          return {
            uid: c.uid,
            issuer: c.issuer,
            recipient: c.recipient,
            time: c.created_at,
            type: 'offchain' as CredentialType,
          };
        });
      }
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

// TODO: search offchain by address
export const useCredentialsByAddress = ({
  page,
  limit,
  address,
}: {
  page: number;
  limit: number;
  address: THexString;
}) => {
  const tronWeb = useTronWeb();
  return useQuery({
    queryKey: [QueryKeys.Credential.Address, address, page, limit],
    queryFn: async (): Promise<{
      issued: number;
      received: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onchainCredentials: any[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      offchainCredentials: any[];
    }> => {
      const issueCredentailEvents =
        await EventQuery.getEventsByContractAddress<IssueCredentialEvent>(
          tronWeb,
          ProjectENV.NEXT_PUBLIC_SUN_ID_ADDRESS as TTronAddress
        );

      let issued = 0;
      let received = 0;

      const issuedCredentialEvents = issueCredentailEvents.filter((e) => {
        if (e.name === 'Issued') {
          if (e.result.issuer === address) {
            issued++;
            return true;
          } else if (e.result.recipient === address) {
            received++;
            return true;
          }
        }
        return false;
      });

      const onchainCredentials = issuedCredentialEvents.map((e) => {
        return {
          uid: ('0x' + e.result.uid) as THexString,
          issuer: e.result.issuer,
          recipient: e.result.recipient,
          time: e.timestamp / 1000,
          type: 'onchain' as CredentialType,
        };
      });

      const { items, address_counts } = (await CredentialApi.search({
        page,
        limit,
        address,
      })) as CredentialsPaginationResponse;
      const offchainCredentials = items.map((c) => {
        return {
          uid: c.uid,
          issuer: c.issuer,
          recipient: c.recipient,
          time: c.created_at,
          type: 'offchain' as CredentialType,
        };
      });

      return {
        issued: issued + address_counts.issued,
        received: received + address_counts.received,
        onchainCredentials,
        offchainCredentials,
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
