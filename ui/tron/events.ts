import { EventResult, TronWebWithExt } from '@/types/tronWeb';

export class EventQuery {
  static async getEventsByTransactionID<T = unknown>(
    transactionID: string
  ): Promise<EventResult<T>[]> {
    return await (window.tronWeb as TronWebWithExt).event.getEventsByTransactionID<T>(
      transactionID
    );
  }
}
