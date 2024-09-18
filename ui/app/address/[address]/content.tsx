'use client';

import { CredentialSchemaRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import { CredentialSchemaTableHeaders } from '@/constants/table';
import { useCredentialsByAddress } from '@/hooks/useCredentials';

export const UserCredentialList: IComponent<{ address: string }> = ({ address }) => {
  //   const tronweb = useTronWeb();
  //   const searchParams = useSearchParams();

  //   const offchain = searchParams.get('offchain') === 'true';
  const { data, isFetching } = useCredentialsByAddress({
    page: 1,
    address,
  });

  return (
    <section>
      <div>
        <h1 className="text-2xl font-bold">Address: {address}</h1>
        <div className="flex gap-4">
          <div>Issued: {data?.issued} Credential</div>
          <div>Received: {data?.received} Credential</div>
        </div>
      </div>
      <SunTable
        title="List of credentials"
        columns={CredentialSchemaTableHeaders}
        items={data?.credentials ?? []}
        isLoading={isFetching}
        renderRow={CredentialSchemaRow}
        maxItems={ITEMS_PER_PAGE.CREDENTIAL}
        //   pagination={{
        //     currentPage: currentPage,
        //     totalItems: totalCredentials,
        //     onPageChange: (page) => setCurrentPage(page),
        //   }}
        //   renderRightTop={
        //     <div className="flex px-2 py-1 rounded-sm">
        //       <button
        //         className={`px-4 py-2 ${isOnchain ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        //         onClick={() => setIsOnchain(true)}>
        //         Onchain
        //       </button>
        //       <button
        //         className={`px-4 py-2 ${!isOnchain ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        //         onClick={() => setIsOnchain(false)}>
        //         Offchain
        //       </button>
        //     </div>
        //   }
      />
    </section>
  );
};
