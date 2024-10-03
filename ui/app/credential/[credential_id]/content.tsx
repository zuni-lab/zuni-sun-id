'use client';

import { Chip } from '@/components/builders/Chip';
import { Button } from '@/components/shadcn/Button';
import { useTron } from '@/components/TronProvider';
import { ToastTemplate } from '@/constants/toast';
import { useCredentialContract } from '@/hooks/useContract';
import { useCredentialDetail } from '@/hooks/useCredentials';
import { useTxResult } from '@/states/useTxResult';
import { cx, EMPTY_UID, getRelativeTime, toTronAddress } from '@/utils/tools';
import { ProjectENV } from '@env';
import { Loader } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const RuleItem: IComponent<{
  type: string;
  name: string;
}> = ({ type, name }) => {
  return (
    <div className="flex gap-2 rounded-md overflow-hidden">
      <div className="w-2/5 bg-gray-300 flex items-center px-4 font-medium uppercase">{type}</div>
      <div className="w-3/5 bg-primary p-2">
        <div className="font-bold">{name}</div>
      </div>
    </div>
  );
};

export const DetailCredential: IComponent<{ credentialId: string }> = ({ credentialId }) => {
  const searchParams = useSearchParams();
  const { open: openTxResult } = useTxResult();
  const { connected, address } = useTron();
  const [submitting, setSubmitting] = useState(false);

  const credentialType = (searchParams.get('type') || 'onchain') as CredentialType;
  const { data: credential, isFetching } = useCredentialDetail(
    credentialId as THexString,
    credentialType
  );
  const { data: contract } = useCredentialContract();

  const handleRevoke = async () => {
    setSubmitting(true);

    if (!credential || !contract) return;

    try {
      let tx;
      if (credential.type === 'onchain') {
        tx = await contract.send({
          method: 'revoke',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          args: [[credential.schema.uid, credential.uid] as any],
        });
      } else {
        tx = await contract.send({
          method: 'revokeOffchain',
          args: [credential.uid],
        });
      }
      ToastTemplate.Credential.SubmitOnChain();

      openTxResult(tx);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      ToastTemplate.Schema.SubmitError();
    } finally {
      setSubmitting(false);
    }
    return;
  };

  return (
    <main>
      {isFetching ? (
        <Loader className="w-12 h-12 animate-spin m-auto mt-12" />
      ) : credential && credential.uid !== EMPTY_UID ? (
        <div>
          <section className="flex flex-col gap-4 mt-10">
            <div className="flex items-center">
              <div className="flex items-center justify-between w-full">
                <div className="font-bold ps-4">{credential.uid}</div>
                {credential.revocable &&
                  credential.revocationTime === 0 &&
                  toTronAddress(credential.issuer) === address && (
                    <div
                      className={cx('flex items-center rounded-xl overflow-hidden w-52', {
                        'cursor-pointer': connected,
                        'cursor-not-allowed': !connected,
                        'bg-orange-500': !submitting,
                        'bg-gray-500': submitting,
                      })}>
                      <Button
                        type={'submit'}
                        className={cx('px-4 rounded-r-none grow', {
                          'bg-orange-500 hover:bg-orange-400': !submitting,
                          'bg-gray-500': submitting,
                        })}
                        size={'lg'}
                        onClick={handleRevoke}
                        disabled={submitting}>
                        {submitting ? (
                          <Loader className="w-4 h-4 text-background animate-spin" />
                        ) : (
                          'Revoke'
                        )}
                      </Button>
                    </div>
                  )}
              </div>
            </div>
            <div className="flex items-center">
              <Chip text={`#${credential.schema?.id}`} />
              <div className="ms-4">
                <div className="font-bold">{credential.schema?.name}</div>
                <div className="font-bold">{credential.uid}</div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {credential.data?.map(({ name, value }, index) => (
                <RuleItem key={index} type={name} name={value as string} />
              ))}
            </div>
            <div>Holder: {credential.recipient && toTronAddress(credential.recipient)}</div>
            <div>Issuer: {credential.issuer && toTronAddress(credential.issuer)}</div>
            <div>
              Created at: {new Date(credential.timestamp).toUTCString()} (
              {getRelativeTime(credential.timestamp / 1000)})
            </div>
            <div>
              Expiration at:
              {credential.expirationTime == 0
                ? 'Never'
                : `${new Date(credential.expirationTime).toUTCString()}${getRelativeTime(credential.expirationTime / 1000)}`}
            </div>
            {credential.refUID !== EMPTY_UID && <div>RefUID: {credential.refUID}</div>}
            {credential.revocationTime > 0 && (
              <div>
                Revoked at:{new Date(credential.revocationTime).toUTCString()} (
                {getRelativeTime(credential.revocationTime / 1000)})
              </div>
            )}
            <hr className="my-4" />
            {credential.cid && (
              <div className="flex gap-2">
                Credential link:
                <a
                  target="_blank"
                  className="text-blue-500"
                  href={`${ProjectENV.NEXT_PUBLIC_BTFS_GATEWAY_URL}/btfs/${credential.cid}`}>
                  {`${ProjectENV.NEXT_PUBLIC_BTFS_GATEWAY_URL}/btfs/${credential.cid}`}
                </a>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div>Not Found</div>
      )}
    </main>
  );
};
