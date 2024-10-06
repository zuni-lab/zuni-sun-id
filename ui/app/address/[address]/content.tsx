'use client';

import {
  CredentialTypeSwitch,
  useCredentialType,
} from '@/components/builders/CredentialTypeSwitch';
import { CopyToClipboard } from '@/components/builders/HexLink';
import { CredentialSchemaRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import { CredentialSchemaTableHeaders } from '@/constants/table';
import { useCredentialsByAddress } from '@/hooks/useCredentials';
import { toHexAddress } from '@/utils/tools';

export const UserCredentialList: IComponent<{ address: string }> = ({ address }) => {
  const { credentialType, setCredentialType } = useCredentialType();

  const { data, isFetching } = useCredentialsByAddress({
    page: 1,
    address: toHexAddress(address),
    limit: ITEMS_PER_PAGE.CREDENTIAL,
  });

  return (
    <section className="px-0 mt-12">
      <div className="px-8">
        <p className="text-2xl font-bold flex items-center gap-2">
          {address}
          <CopyToClipboard content={address} />
        </p>
        <div className="flex gap-8 mt-4 font-semibold">
          <div>
            <span className="bg-green-500 p-1 px-2 rounded-md text-white">Issued</span>{' '}
            {data?.issued ?? '-'} credentials
          </div>
          <div>
            <span className="bg-orange-500 p-1 px-2 rounded-md text-white">Received</span>{' '}
            {data?.received ?? '-'} credentials
          </div>
        </div>
      </div>
      <SunTable
        title="List of credentials"
        columns={CredentialSchemaTableHeaders}
        items={credentialType === 'onchain' ? data?.onchainCredentials : data?.offchainCredentials}
        isLoading={isFetching}
        renderRow={CredentialSchemaRow}
        maxItems={ITEMS_PER_PAGE.CREDENTIAL}
        renderRightTop={
          <div className="my-4">
            <CredentialTypeSwitch
              credentialType={credentialType}
              setCredentialType={setCredentialType}
            />
          </div>
        }
        button="none"
      />
    </section>
  );
};
