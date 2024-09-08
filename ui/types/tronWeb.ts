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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contract: any;
};
