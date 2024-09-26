'use client';

import { Chip } from '@/components/builders/Chip';
import { useTronWeb } from '@/components/TronProvider';
import { useCredentialDetail } from '@/hooks/useCredentials';
import { EMPTY_UID, getRelativeTime } from '@/utils/tools';
import { Loader } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const RuleItem: IComponent<{
  type: string;
  name: string;
}> = ({ type, name }) => {
  return (
    <div className="flex gap-2 rounded-md overflow-hidden">
      <div className="w-2/5 bg-gray-700 flex items-center px-4 font-medium uppercase">{type}</div>
      <div className="w-3/5 bg-primary p-2">
        <div className="font-bold">{name}</div>
      </div>
    </div>
  );
};

export const DetailCredential: IComponent<{ credentialId: string }> = ({ credentialId }) => {
  const tronweb = useTronWeb();
  const searchParams = useSearchParams();

  const credentialType = (searchParams.get('type') || 'onchain') as CredentialType;
  const { data: credential, isFetching } = useCredentialDetail(
    credentialId as THexString,
    credentialType
  );

  return (
    <main>
      {isFetching ? (
        <Loader className="w-12 h-12 animate-spin m-auto mt-12" />
      ) : credential ? (
        <div>
          <section className="flex flex-col gap-4 mt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="font-bold ps-4">{credential.uid}</div>
              </div>
            </div>
            <div>
              <div className="flex">
                <Chip text={`#${credential.schema?.id}`} />
                <div>
                  <div className="font-bold">{credential.schema?.name}</div>
                  <div className="font-bold">{credential.uid}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {credential.data?.map(({ name, value }, index) => (
                <RuleItem key={index} type={name} name={value as string} />
              ))}
            </div>
            <div>
              Holder: {credential.recipient && tronweb.address.fromHex(credential.recipient)}
            </div>
            <div>Issuer: {credential.issuer && tronweb.address.fromHex(credential.issuer)}</div>
            <div>
              Created at: {new Date(credential.timestamp).toUTCString()} (
              {getRelativeTime(credential.timestamp / 1000)})
            </div>
            <div>
              Expiration at:
              {credential.expirationTime == 0 || !credential.expirationTime
                ? 'Never'
                : `${new Date(credential.expirationTime).toUTCString()}${getRelativeTime(credential.expirationTime / 1000)}`}
            </div>
            {credential.refUID !== EMPTY_UID && <div>RefUID: {credential.refUID}</div>}
            {credential.revocationTime && credential.revocationTime > 0 && (
              <div>
                Revoked at:{new Date(credential.revocationTime).toUTCString()} (
                {getRelativeTime(credential.revocationTime / 1000)})
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
