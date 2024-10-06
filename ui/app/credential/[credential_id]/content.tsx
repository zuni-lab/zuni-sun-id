'use client';

import { ProjectENV } from '@env';
import { Loader } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Chip } from '@/components/builders/Chip';
import { DetailItem } from '@/components/builders/DetailItem';
import { HexLink } from '@/components/builders/HexLink';
import { NotFound } from '@/components/NotFound';
import { Button, buttonVariants } from '@/components/shadcn/Button';
import { useTron } from '@/components/TronProvider';
import { AppRouter } from '@/constants/router';
import { ToastTemplate } from '@/constants/toast';
import { useCredentialContract } from '@/hooks/useContract';
import { useCredentialDetail } from '@/hooks/useCredentials';
import { useTxResult } from '@/states/useTxResult';
import { cx, EMPTY_UID, getRelativeTime, isCredentialValid, toTronAddress } from '@/utils/tools';

export const DetailCredential: IComponent<{ credentialId: string }> = ({ credentialId }) => {
  const searchParams = useSearchParams();
  const { open: openTxResult } = useTxResult();
  const { connected, address } = useTron();
  const [submitting, setSubmitting] = useState(false);

  const credentialType = (searchParams.get('type') || 'onchain') as CredentialType;
  const {
    data: credential,
    isFetching,
    refetch,
  } = useCredentialDetail(credentialId as THexString, credentialType);
  const { data: contract } = useCredentialContract();
  const isValid =
    !!credential && isCredentialValid(credential.revocationTime, credential.expirationTime);

  const handleRevoke = async () => {
    setSubmitting(true);

    if (!credential || !contract) return;

    try {
      let tx;
      if (credential.type === 'onchain') {
        tx = await contract.send({
          method: 'revoke',
          args: [[credential.schema.uid, credential.uid] as any],
        });
      } else {
        tx = await contract.send({
          method: 'revokeOffchain',
          args: [credential.uid],
        });
      }
      ToastTemplate.Credential.SubmitOnChain();

      openTxResult(tx, 'RevokeCredential');
      await new Promise((resolve) => setTimeout(resolve, 6_000));
      refetch();
    } catch (error: any) {
      console.error(error);
      ToastTemplate.Credential.SubmitError();
    } finally {
      setSubmitting(false);
    }
    return;
  };

  const renderRevoke = (credential: TCredential) => {
    return (
      <>
        {credential.revocable &&
          credential.revocationTime === 0 &&
          toTronAddress(credential.issuer) === address && (
            <button
              className={buttonVariants({
                variant: 'secondary',
                className: cx('bg-black/80 hover:bg-black/60', {
                  'cursor-pointer': connected,
                  'cursor-not-allowed': !connected,
                  'bg-gray-500': submitting,
                }),
              })}
              onClick={handleRevoke}
              disabled={submitting}>
              {submitting ? <Loader className="w-4 h-4 text-background animate-spin" /> : 'Revoke'}
            </button>
          )}
      </>
    );
  };

  return (
    <main className="py-2">
      {isFetching ? (
        <Loader className="w-12 h-12 animate-spin m-auto mt-12" />
      ) : credential && credential.uid !== EMPTY_UID ? (
        <section className="mt-10">
          <div className="flex justify-between">
            <h1
              className={cx('text-3xl font-bold my-2', {
                'text-primary': credentialType === 'onchain',
                'text-orange-600': credentialType === 'offchain',
              })}>
              {credentialType.charAt(0).toUpperCase() + credentialType.slice(1)} Credential
            </h1>
            {isValid ? (
              renderRevoke(credential)
            ) : (
              <div>
                <Button
                  className={'px-4 rounded grow bg-gray-500 w-48 font-bold'}
                  size={'lg'}
                  disabled={true}>
                  Invalid
                </Button>
              </div>
            )}
          </div>
          <div className="my-2">
            <p className="text-sm text-gray-600 font-bold">UID</p>
            <p className="font-bold">{credential.uid}</p>
          </div>
          <hr className="my-2 border-gray-300" />

          <div className="flex flex-col gap-8">
            <div>
              <p className="text-sm text-gray-600 font-bold my-2">SCHEMA</p>
              <div className="font-bold flex gap-4 items-center bg-red-50 p-4 rounded-xl">
                <Chip text={`#${credential.schema?.id}`} />
                <div>
                  <p className="font-bold">{credential.schema?.name}</p>
                  <HexLink
                    content={credential.schema?.uid}
                    href={`${AppRouter.Schemas}/${credential.schema?.uid}`}
                    className="!font-normal"
                    isFull
                  />
                </div>
              </div>
              <div className="space-y-6 mt-6">
                <DetailItem
                  title="Issuer"
                  value={toTronAddress(credential.issuer)}
                  link={`${AppRouter.Address}/${toTronAddress(credential.issuer)}`}
                />

                <DetailItem
                  title="Holder"
                  value={toTronAddress(credential.recipient)}
                  link={`${AppRouter.Address}/${toTronAddress(credential.recipient)}`}
                />

                <DetailItem
                  title="Created At"
                  value={`${new Date(credential.timestamp).toLocaleDateString()} ${new Date(credential.timestamp).toLocaleTimeString()} (${getRelativeTime(credential.timestamp / 1000)})`}
                />

                <DetailItem
                  title="Expiration"
                  value={`${new Date(credential.expirationTime).toLocaleDateString()} ${new Date(credential.expirationTime).toLocaleTimeString()} (${getRelativeTime(credential.expirationTime / 1000)})`}
                />
                {credential.refUID !== EMPTY_UID && (
                  <DetailItem title="Reference" value={credential.refUID} />
                )}

                {credential.revocationTime > 0 && (
                  <DetailItem
                    title="Revoked at"
                    value={`${new Date(credential.revocationTime).toLocaleDateString()} ${new Date(credential.revocationTime).toLocaleTimeString()} (${getRelativeTime(credential.revocationTime / 1000)})`}
                  />
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-bold my-2 uppercase">Credential Data</p>
              <div className="w-full flex flex-col gap-4">
                {credential.data?.map(({ name, value }, index) => (
                  <div key={index} className="flex gap-1 rounded-md overflow-hidden text-white">
                    <div className="w-1/5 bg-main flex items-center px-4 font-semibold uppercase">
                      {name}
                    </div>
                    <div className="w-4/5 p-2 bg-gray-700">
                      <div className=" font-bold">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <hr className="mb-4 border-gray-300" />

          {credential.type === 'onchain' && (
            <DetailItem
              title="Transaction"
              value={credential.txhash ?? ''}
              link={`${ProjectENV.NEXT_PUBLIC_TRON_SCAN_URL}/#/transaction/${credential.txhash}`}
            />
          )}

          {credential.type === 'offchain' && (
            <DetailItem
              title="BTFS link"
              value={`${ProjectENV.NEXT_PUBLIC_BTFS_GATEWAY_URL}/btfs/${credential.cid}`}
              link={`${ProjectENV.NEXT_PUBLIC_BTFS_GATEWAY_URL}/btfs/${credential.cid}`}
            />
          )}
        </section>
      ) : (
        <NotFound />
      )}
    </main>
  );
};
