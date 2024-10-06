import { EventResult, TronWebWithExt } from '@/types/tronWeb';

export class EventQuery {
  static async getEventsByTransactionID<T = unknown>(
    provider: TronWebWithExt,
    transactionID: string
  ): Promise<EventResult<T>[]> {
    return await provider.event.getEventsByTransactionID<T>(transactionID);
  }
  static async getEventsByContractAddress<T = unknown>(
    provider: TronWebWithExt,
    contractAddress: string,
    options?: {
      fromTimestamp?: number;
      eventName?: string;
      blockNumber?: number;
      size?: number;
      page?: number;
      onlyConfirmed?: boolean;
      onlyUnconfirmed?: boolean;
      filters?: object;
    }
  ): Promise<EventResult<T>[]> {
    return await provider.event.getEventsByContractAddress<T>(contractAddress, options);
  }
}

export class TxQuery {
  // 
  static async getTransactionInfo(provider: TronWebWithExt, transactionID: string): Promise<any> {
    return await provider.trx.getTransactionInfo(transactionID);
  }
}
