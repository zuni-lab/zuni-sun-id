import { SUN_ID_ABI } from '@/constants/abi';
import { QueryKeys } from '@/constants/configs';
import { TronContract } from '@/tron/contract';
import { ProjectENV } from '@env';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hexToNumber, toHexAddress, toTronAddress } from '@/utils/tools';
import { getSchemaContract } from './useSchemas';
import { EventQuery } from '@/tron/query';
import { useTronWeb } from '@/components/TronProvider';

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

export const useCredentials = ({ page, limit }: { page: number; limit: number }) => {
  const { data: totalCredentials } = useCountCredentials();

  const {
    data: items,
    isLoading: isFetching,
    refetch: refetchSchemas,
  } = useQuery({
    queryKey: [QueryKeys.Credential.List, page],
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

      return credentials.toReversed().map((c, idx) => {
        return {
          uid: c.uid,
          schema: {
            id: hexToNumber(schemas[idx].id),
            name: schemas[idx].name,
          },
          issuer: toTronAddress(c.issuer),
          recipient: toTronAddress(c.recipient),
          time: hexToNumber(c.time),
          type: 'onchain',
        };
      });
    },
    throwOnError: true,
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

  return useQuery({
    queryKey: [QueryKeys.Credential.Detail, credentialId],
    queryFn: async () => {
      if (!onchain) {
        throw new Error('Offchain credential not implemented');
      }

      const schemaContract = await getSchemaContract();
      const sunId = await getSunIdContract();

      const [credential] = await sunId.call({
        method: 'getCredential',
        args: [credentialId],
      });

      const [schema] = await schemaContract.call({
        method: 'getSchema',
        args: [credential.schema],
      });

      const definition = schema.schema.split(',').map((field) => {
        const [fieldType, fieldName] = field.split(' ');
        return { fieldType, fieldName } as TSchemaDefinition;
      });

      const dataTypes = definition.map((field) => field.fieldType);
      const dataValues = tronweb.utils.abi.decodeParams(dataTypes, credential.data);
      const data = dataValues.map((v, i) => {
        return {
          name: definition[i].fieldName,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: (v as any).toString(),
        };
      });

      return {
        uid: credential.uid,
        schema: {
          id: Number(schema.id),
          uid: schema.uid,
          name: schema.name,
        },
        data,
        issuer: toTronAddress(credential.issuer),
        recipient: toTronAddress(credential.recipient),
        timestamp: Number(credential.time) * 1000,
        expirationTime: Number(credential.expirationTime) * 1000,
        revocationTime: Number(credential.revocationTime) * 1000,
        refUID: credential.refUID,
      };
    },
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

  const {
    data: items,
    isLoading: isFetching,
    refetch: refetchSchemas,
  } = useQuery({
    queryKey: [QueryKeys.Schema.Credentials, schema, page],
    queryFn: async () => {
      const schemaEvents = await EventQuery.getEventsByContractAddress<IssueCredentialEvent>(
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
  return useQuery({
    queryKey: [QueryKeys.Credential.Address, address, page],
    queryFn: async () => {
      const issueCredentailEvents =
        await EventQuery.getEventsByContractAddress<IssueCredentialEvent>(
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
