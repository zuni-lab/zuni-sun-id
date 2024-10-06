'use client';

import { ProjectENV } from '@env';
import { Loader } from 'lucide-react';

import { AppRouter } from '@/constants/router';
import { useTxInfo } from '@/hooks/useTxInfo';
import { useTxResult } from '@/states/useTxResult';
import { cx } from '@/utils/tools';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../shadcn/Dialog';
import { HexLink } from './HexLink';

const MAX_RETRIES = 15;

export const TxResult: IComponent = () => {
  const { visible, txHash, txResultType, close } = useTxResult();
  const { txInfo, isLoading, isError, error } = useTxInfo<GeneralUIDEvent>(txHash, MAX_RETRIES);

  return (
    <Dialog open={visible}>
      <DialogContent
        className={cx('bg-white max-w-4xl min-h-32 max-h-80', {
          'w-[400px]': isLoading,
        })}
        onClose={close}>
        <DialogHeader>
          <DialogTitle>
            {isLoading
              ? 'Loading transaction info'
              : isError
                ? 'Error loading transaction'
                : txResultType === 'RegisterSchema'
                  ? 'Registered Schema Successfully'
                  : txResultType === 'IssueCredential'
                    ? 'Issued Credential Successfully'
                    : 'Revoked Credential Successfully'}
          </DialogTitle>
          <DialogDescription>
            {isLoading && (
              <span>
                <Loader className="w-12 h-12 animate-spin m-auto mt-2" />
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
                      <strong>
                        {txResultType === 'RegisterSchema' ? 'Schema UID:' : 'Credential UID:'}
                      </strong>
                      <HexLink
                        content={'0x' + txInfo.result.uid}
                        href={`${txResultType === 'RegisterSchema' ? AppRouter.Schemas : AppRouter.Credentials}/0x${txInfo.result.uid}`}
                        className="text-sm pl-0"
                        isFull
                      />
                    </p>
                    <p>
                      <strong>Transaction:</strong>
                      <HexLink
                        content={txInfo.transaction}
                        href={`${ProjectENV.NEXT_PUBLIC_TRON_SCAN_URL}/#/transaction/${txInfo.transaction}`}
                        className="text-sm pl-0"
                        isFull
                      />
                    </p>
                    <p>
                      <strong>Timestamp:</strong> {new Date(txInfo.timestamp).toDateString()} -{' '}
                      {new Date(txInfo.timestamp).toLocaleTimeString()}
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
