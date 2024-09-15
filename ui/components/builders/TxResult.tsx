'use client';

import { useTxInfo } from '@/hooks/useTxInfo';
import { useTxResult } from '@/states/useTxResult';
import { cx } from '@/utils/tools';
import { Loader } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../shadcn/Dialog';

const MAX_RETRIES = 10;

export const TxResult: IComponent = () => {
  const { visible, txHash, close } = useTxResult();
  const { txInfo, isLoading, isError, error } = useTxInfo(txHash, MAX_RETRIES);

  return (
    <Dialog open={visible}>
      <DialogContent
        className={cx('bg-white text-accent  max-w-4xl min-h-32 max-h-80', {
          'w-[400px]': isLoading,
        })}
        onClose={close}>
        <DialogHeader>
          <DialogTitle>
            {isLoading
              ? 'Loading transaction info'
              : isError
                ? 'Error loading transaction'
                : 'Events'}
          </DialogTitle>
          <DialogDescription>
            {isLoading && (
              <span>
                <Loader className="w-12 h-12 text-background animate-spin m-auto mt-2" />
              </span>
            )}
            {!isLoading && (
              <>
                {isError && (
                  <p>Failed to load info for this transaction. Error: {error?.message}</p>
                )}
                {!txInfo && (
                  <div className="my-4 space-y-2">
                    <p className="text-destructive">No info found for this transaction.</p>
                    <p>Transaction hash: #{txHash}</p>
                  </div>
                )}
                {!isLoading && !!txInfo ? (
                  <div className="w-full bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4 shadow-sm space-y-4 mt-4">
                    <p>
                      <strong>Transaction:</strong> #{txInfo.id}
                    </p>
                    <p>
                      <strong>Block:</strong> {txInfo.blockNumber}
                    </p>
                    <p>
                      <strong>Contract:</strong> {txInfo.contract_address}
                    </p>

                    <p>
                      <strong>Timestamp:</strong>{' '}
                      {new Date(txInfo.blockTimeStamp / 1000).toDateString()} -{' '}
                      {new Date(txInfo.blockTimeStamp / 1000).toLocaleTimeString()}
                    </p>
                    <p className="truncate">
                      <strong>Result:</strong>{' '}
                      <span
                        className={cx({
                          'text-green-600': txInfo.result === 'SUCCESS',
                          'text-destructive':
                            txInfo?.result === 'FAILED' || txInfo?.receipt?.result === 'REVERT',
                        })}>
                        {txInfo?.result || txInfo?.receipt?.result || 'PENDING'}
                      </span>
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
