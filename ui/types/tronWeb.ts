import { TronWeb } from '@tronweb3/tronwallet-adapters';

export type EventResult<T = unknown> = {
  block: number;
  contract: string;
  name: string;
  timestamp: number;
  transaction: string;
  result: T;
};

export type TronWebWithExt = TronWeb & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contract: (abi: any, address: string) => Promise<any>;
  event: {
    getEventsByContractAddress<T = unknown>(
      contractAddress: string,
      options?: {
        fromTimestamp?: number;
        eventName?: string;
        blockNumber?: number;
        size?: number; // default 20, max 200
        page?: number;
        onlyConfirmed?: boolean;
        onlyUnconfirmed?: boolean;
        filters?: object;
        // sort,
        // previousLastEventFingerprint,
        // previousFingerprint,
        // fingerprint,
        // rawResponse,
      }
    ): Promise<EventResult<T>[]>;
    getEventsByTransactionID<T = unknown>(transactionID: string): Promise<EventResult<T>[]>;
  };
  utils: {
    abi: {
      encodeParams(types: string[], values: unknown[]): string;
      decodeParams(types: string[], data: string): unknown[];
    };
  };
  trx: {
    getTransactionInfo(transactionID: string): Promise<{
      id: string;
      fee: number;
      blockNumber: number;
      blockTimeStamp: number;
      contract_address: string;
      contractResult: string[];
      log: {
        address: string;
        topics: string[];
      }[];
      receipt: {
        origin_energy_usage: number;
        energy_usage_total: number;
        net_fee: number;
        result: 'SUCCESS' | 'FAILED' | 'REVERT';
      };
      result: 'SUCCESS' | 'FAILED';
    }>;
  };
};
