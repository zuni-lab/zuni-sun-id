'use client';

import { Chip } from '@/components/builders/Chip';
import { useTronWeb } from '@/components/TronProvider';
import { useCredentialDetail } from '@/hooks/useCredentials';
import { EMPTY_UID, getRelativeTime } from '@/utils/tools';
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

  const offchain = searchParams.get('offchain') === 'true';

  const { data, isFetching } = useCredentialDetail(credentialId as THexString, !offchain);
  console.log(data);
  return (
    <div>
      {isFetching ? (
        <div>Loading</div>
      ) : data ? (
        <div>
          <section className="flex flex-col gap-4 mt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="font-bold ps-4">{data.uid}</div>
              </div>
            </div>
            <div>
              <div className="flex">
                <Chip text={`#${data.schema.id}`} />
                <div>
                  <div className="font-bold">{data.schema.name}</div>
                  <div className="font-bold">{data.uid}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {data.data.map(({ name, value }, index) => (
                <RuleItem key={index} type={name} name={value as string} />
              ))}
            </div>
            <div>Holder: {data.recipient && tronweb.address.fromHex(data.recipient)}</div>
            <div>Issuer: {data.issuer && tronweb.address.fromHex(data.issuer)}</div>
            <div>
              Created at: {new Date(data.timestamp).toUTCString()} (
              {getRelativeTime(data.timestamp / 1000)})
            </div>
            <div>
              Expiration at:
              {data.expirationTime == 0 ? 'Never' : new Date(data.expirationTime).toUTCString()} (
              {getRelativeTime(data.expirationTime / 1000)})
            </div>
            {data.refUID !== EMPTY_UID && <div>RefUID: {data.refUID}</div>}
            {data.revocationTime > 0 && (
              <div>
                Revoked at:{new Date(data.revocationTime).toUTCString()} (
                {getRelativeTime(data.revocationTime / 1000)})
              </div>
            )}
          </section>
        </div>
      ) : (
        <div>Not Found</div>
      )}
    </div>
  );
};
