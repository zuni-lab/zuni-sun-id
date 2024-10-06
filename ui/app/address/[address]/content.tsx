'use client';

import { useState } from 'react';

import { CredentialSchemaRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import { CredentialSchemaTableHeaders } from '@/constants/table';
import { useCredentialsByAddress } from '@/hooks/useCredentials';
import { toHexAddress } from '@/utils/tools';

export const UserCredentialList: IComponent<{ address: string }> = ({ address }) => {
  //   const tronweb = useTronWeb();
  //   const searchParams = useSearchParams();

  const [credentialType, setCredentialType] = useState<CredentialType>('onchain');
  const { data, isFetching } = useCredentialsByAddress({
    page: 1,
    address: toHexAddress(address),
    limit: ITEMS_PER_PAGE.CREDENTIAL,
  });

  return (
    <section>
      <div>
        <h1 className="text-2xl font-bold">Address: {address}</h1>
        <div className="flex gap-4">
          <div>Issued: {data?.issued} credentials</div>
          <div>Received: {data?.received} credentials</div>
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
          <div className="flex px-2 py-1 rounded-sm">
            <button
              className={`px-4 py-2 ${credentialType === 'onchain' ? 'bg-blue-500 ' : 'bg-gray-200 text-black'}`}
              onClick={() => setCredentialType('onchain')}>
              Onchain
            </button>
            <button
              className={`px-4 py-2 ${credentialType === 'offchain' ? 'bg-blue-500 ' : 'bg-gray-200 text-black'}`}
              onClick={() => setCredentialType('offchain')}>
              Offchain
            </button>
          </div>
        }
      />
    </section>
  );
};
