'use client';

import { Loader } from 'lucide-react';
import { useState } from 'react';

import { Chip } from '@/components/builders/Chip';
import {
  CredentialTypeSwitch,
  useCredentialType,
} from '@/components/builders/CredentialTypeSwitch';
import { DetailItem } from '@/components/builders/DetailItem';
import { CopyToClipboard } from '@/components/builders/HexLink';
import { CredentialSchemaRow } from '@/components/builders/RenderRow';
import { RuleItem } from '@/components/builders/RuleItem';
import { SunIDButton } from '@/components/builders/SunIDButton';
import { SunTable } from '@/components/builders/SunTable';
import { useTronWeb } from '@/components/TronProvider';
import { ITEMS_PER_PAGE, tronNetworks } from '@/constants/configs';
import { AppRouter } from '@/constants/router';
import { CredentialSchemaTableHeaders } from '@/constants/table';
import { useCountCredentials, useCredentialsBySchema } from '@/hooks/useCredentials';
import { useDetailSchema } from '@/hooks/useSchemas';
import { getRelativeTime, isZeroAddress } from '@/utils/tools';

export const DetailSchema: IComponent<{ schemaId: THexString }> = ({ schemaId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { credentialType, setCredentialType } = useCredentialType();

  const tronweb = useTronWeb();
  const { data, isLoading } = useDetailSchema(schemaId as THexString);

  const { data: totalCredentials } = useCountCredentials({ credentialType });

  const { items, isFetching } = useCredentialsBySchema({
    page: currentPage,
    schema: schemaId,
    limit: ITEMS_PER_PAGE.CREDENTIAL,
    credentialType,
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
        <div className="space-y-1">
          <section className="flex flex-col gap-4 mt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Chip text={`#${data.id}`} />
                <div className="font-bold ps-4 pr-2">{data.uid}</div>
                <CopyToClipboard content={data.uid} />
              </div>
              <SunIDButton
                href={`${AppRouter.Credentials}/issue/${data.uid}`}
                name="Issue Credential With This Schema"
              />
            </div>
            <hr className="my-2 bg-gray-300 border-gray-300" />
            <div className="flex gap-8">
              <div className="space-y-4">
                <DetailItem title="Name" value={data.name} />
                <DetailItem
                  title="Revocable"
                  value={data.revocable ? 'Yes' : 'No'}
                  valueClassname={data.revocable ? 'text-orange-500' : 'text-gray-500'}
                />
                <DetailItem
                  title="Resolver"
                  value={isZeroAddress(data.resolver) ? 'None' : data.resolver}
                />
                <DetailItem
                  title="Transaction"
                  value={`0x${data.tx}`}
                  link={`${tronNetworks.Shasta.scanner}/#/transaction/${data.tx}`}
                />
                <DetailItem
                  title="Created By"
                  value={data.creator && tronweb.address.fromHex(data.creator)}
                  link={`${AppRouter.Address}/${data.creator}`}
                />
                <DetailItem
                  title="Created At"
                  value={`${new Date(data.timestamp).toLocaleDateString()}  ${new Date(data.timestamp).toLocaleTimeString()} (${getRelativeTime(data.timestamp)})`}
                />
              </div>
              <div className="px-4 grow">
                <h1 className="text-sm font-semibold text-gray-600 mb-1 uppercase">Schema</h1>
                <div className="w-full flex flex-col gap-4">
                  {data.definition.map(({ fieldName, fieldType }, index) => (
                    <RuleItem key={index} type={fieldType} name={fieldName} />
                  ))}
                </div>
              </div>
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
              totalItems: totalCredentials || 0,
              onPageChange: (page) => setCurrentPage(page),
            }}
            renderBellowHeader={
              <CredentialTypeSwitch
                credentialType={credentialType}
                setCredentialType={(value) => {
                  setCredentialType(value);
                }}
              />
            }
            button="none"
          />
        </div>
      )}
    </main>
  );
};
