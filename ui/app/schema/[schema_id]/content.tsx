'use client';

import { Chip } from '@/components/builders/Chip';
import { CredentialSchemaRow } from '@/components/builders/RenderRow';
import { SunIDButton } from '@/components/builders/SunIDButton';
import { SunTable } from '@/components/builders/SunTable';
import { useTronWeb } from '@/components/TronProvider';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import { AppRouter } from '@/constants/router';
import { CredentialSchemaTableHeaders } from '@/constants/table';
import { useCountCredentials, useCredentialsBySchema } from '@/hooks/useCredentials';
import { useDetailSchema } from '@/hooks/useSchemas';
import { getRelativeTime, isZeroAddress } from '@/utils/tools';
import { Loader } from 'lucide-react';
import { useState } from 'react';

const RuleItem: IComponent<{
  type: string;
  name: string;
}> = ({ type, name }) => {
  return (
    <div className="flex gap-2 rounded-md overflow-hidden ">
      <div className="w-2/5 bg-gray-700 flex items-center px-4 font-medium uppercase">{type}</div>
      <div className="w-3/5 bg-primary p-2">
        <div className=" font-bold">{name}</div>
      </div>
    </div>
  );
};

export const DetailSchema: IComponent<{ schemaId: string }> = ({ schemaId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOnchain, setIsOnchain] = useState(true);

  const tronweb = useTronWeb();
  const { data, isLoading } = useDetailSchema(schemaId as THexString);

  const { data: totalCredentials } = useCountCredentials();

  const { items, isFetching } = useCredentialsBySchema({
    page: currentPage,
    schema: schemaId,
    // limit: ITEMS_PER_PAGE.CREDENTIAL,
  });

  if (isLoading) {
    return (
      <main>
        <Loader className="w-12 h-12 animate-spin m-auto mt-12" />;
      </main>
    );
  }

  return (
    <main>
      {!isLoading && data && (
        <div>
          <section className="flex flex-col gap-4 mt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Chip text={`#${data.id}`} />
                <div className="font-bold ps-4">{data.uid}</div>
              </div>
              <SunIDButton
                href={`${AppRouter.Credential}/issue/${data.uid}`}
                name="Issue Credential"
              />
            </div>
            <div className="font-bold">Schema Name: {data.name}</div>
            <div className="flex flex-col gap-4">
              {data.definition.map(({ fieldName, fieldType }, index) => (
                <RuleItem key={index} type={fieldType} name={fieldName} />
              ))}
            </div>
            <div>Revocable Credentials: {data.revocable ? 'Yes' : 'No'}</div>
            <div>Schema Resolver: {isZeroAddress(data.resolver) ? 'None' : data.resolver}</div>
            <div>Transaction ID: 0x{data.tx}</div>
            <div>Created by: {data.creator && tronweb.address.fromHex(data.creator)}</div>
            <div>
              Created at: {new Date(data.timestamp).toUTCString()} (
              {getRelativeTime(data.timestamp / 1000)})
            </div>
          </section>
          <SunTable
            title="List of credentials"
            columns={CredentialSchemaTableHeaders}
            items={items ?? []}
            isLoading={isFetching}
            renderRow={CredentialSchemaRow}
            maxItems={ITEMS_PER_PAGE.CREDENTIAL}
            pagination={{
              currentPage: currentPage,
              totalItems: totalCredentials,
              onPageChange: (page) => setCurrentPage(page),
            }}
            renderRightTop={
              <div className="flex px-2 py-1 rounded-sm">
                <button
                  className={`px-4 py-2 ${isOnchain ? 'bg-blue-500 ' : 'bg-gray-200 text-black'}`}
                  onClick={() => setIsOnchain(true)}>
                  Onchain
                </button>
                <button
                  className={`px-4 py-2 ${!isOnchain ? 'bg-blue-500 ' : 'bg-gray-200 text-black'}`}
                  onClick={() => setIsOnchain(false)}>
                  Offchain
                </button>
              </div>
            }
          />
        </div>
      )}
    </main>
  );
};
