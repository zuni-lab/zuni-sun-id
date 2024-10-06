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
  const { visible, txHash, txResultType, close, offchainResult } = useTxResult();
  const { txInfo, isLoading, isError, error } = useTxInfo<GeneralUIDEvent>(txHash, MAX_RETRIES);

  return (
    <Dialog
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}>
      <DialogContent
        className={cx('bg-white max-w-4xl min-h-32 max-h-80', {
          'w-[400px]': isLoading && txResultType !== 'IssueCredentialOffchain',
        })}
        onClose={close}>
        <DialogHeader>
          <DialogTitle>
            {isLoading
              ? txResultType !== 'IssueCredentialOffchain'
                ? 'Loading transaction info'
                : 'Loading offchain result'
              : isError
                ? 'Error loading transaction'
                : txResultType === 'RegisterSchema'
                  ? 'Registered Schema Successfully'
                  : txResultType === 'IssueCredential'
                    ? 'Issued Credential Successfully'
                    : txResultType === 'IssueCredentialOffchain'
                      ? 'Issued Credential Offchain Successfully'
                      : 'Revoked Credential Successfully'}
          </DialogTitle>
          <DialogDescription>
            {isLoading && txResultType !== 'IssueCredentialOffchain' && (
              <span>
                <Loader className="w-12 h-12 animate-spin m-auto mt-2" />
              </span>
            )}
            {!isLoading && txResultType !== 'IssueCredentialOffchain' && (
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
                        onClick={close}
                        content={'0x' + txInfo.result.uid}
                        href={`${txResultType === 'RegisterSchema' ? AppRouter.Schemas : AppRouter.Credentials}/0x${txInfo.result.uid}`}
                        className="text-sm pl-0 text-blue-500"
                        isFull
                      />
                    </p>
                    <p>
                      <strong>Transaction:</strong>
                      <HexLink
                        onClick={close}
                        content={txInfo.transaction}
                        href={`${ProjectENV.NEXT_PUBLIC_TRON_SCAN_URL}/#/transaction/${txInfo.transaction}`}
                        className="text-sm pl-0 text-blue-500"
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

            {txResultType == 'IssueCredentialOffchain' && (
              <>
                {!!offchainResult ? (
                  <div className="w-full bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4 shadow-sm space-y-4 mt-4">
                    <p>
                      <strong>{'Credential UID:'}</strong>
                      <HexLink
                        content={offchainResult.uid}
                        href={`${AppRouter.Credentials}/${offchainResult.uid}?type=offchain`}
                        className="text-sm pl-0 text-blue-500"
                        isFull
                      />
                    </p>
                    <p>
                      <strong>{'BTFS Location:'}</strong>
                      <HexLink
                        content={offchainResult.cid}
                        href={`${ProjectENV.NEXT_PUBLIC_BTFS_GATEWAY_URL}/btfs/${offchainResult.cid}`}
                        className="text-sm pl-0 text-blue-500"
                        isFull
                      />
                    </p>
                    <p>
                      <strong>Schema UID:</strong>
                      <HexLink
                        content={offchainResult.schema_uid}
                        href={`${AppRouter.Schemas}/${offchainResult.schema_uid}`}
                        className="text-sm pl-0 text-blue-500"
                        isFull
                      />
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
