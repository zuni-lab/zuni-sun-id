import { EventResult, TronWebWithExt } from '@/types/tronWeb';

export class EventQuery {
  static async getEventsByTransactionID<T = unknown>(
    transactionID: string
  ): Promise<EventResult<T>[]> {
    return await (window.tronWeb as TronWebWithExt).event.getEventsByTransactionID<T>(
      transactionID
    );
  }
  static async getEventsByContractAddress<T = unknown>(
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
    return await (window.tronWeb as TronWebWithExt).event.getEventsByContractAddress<T>(
      contractAddress,
      options
    );
  }
}

export class TxQuery {
  static async getTransactionInfo(transactionID: string) {
    return await (window.tronWeb as TronWebWithExt).trx.getTransactionInfo(transactionID);
  }
}
