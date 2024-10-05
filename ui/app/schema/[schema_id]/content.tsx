'use client';

import { Chip } from '@/components/builders/Chip';
import { CopyToClipboard } from '@/components/builders/HexLink';
import { CredentialSchemaRow } from '@/components/builders/RenderRow';
import { SunIDButton } from '@/components/builders/SunIDButton';
import { SunTable } from '@/components/builders/SunTable';
import { TabSwitch } from '@/components/builders/TabSwitch';
import { useTronWeb } from '@/components/TronProvider';
import { ITEMS_PER_PAGE, tronNetworks } from '@/constants/configs';
import { AppRouter } from '@/constants/router';
import { CredentialSchemaTableHeaders } from '@/constants/table';
import { useCountCredentials, useCredentialsBySchema } from '@/hooks/useCredentials';
import { useDetailSchema } from '@/hooks/useSchemas';
import { getRelativeTime, isZeroAddress } from '@/utils/tools';
import { link } from 'fs';
import { Loader } from 'lucide-react';
import { useState } from 'react';

const RuleItem: IComponent<{
  type: string;
  name: string;
}> = ({ type, name }) => {
  return (
    <div className="flex gap-1 rounded-md overflow-hidden text-white">
      <div className="w-2/5 bg-main flex items-center px-4 font-semibold uppercase">{type}</div>
      <div className="w-3/5 p-2 bg-gray-700">
        <div className=" font-bold">{name}</div>
      </div>
    </div>
  );
};

const Item: IComponent<{
  title: string;
  value: string;
  link?: string;
}> = ({ title, value, link }) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="w-32 uppercase font-bold  text-gray-600 text-sm">{title}</div>
      <div className="w-1/2 font-semibold text-gray-800">
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
};

export const DetailSchema: IComponent<{ schemaId: THexString }> = ({ schemaId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [credentialType, setCredentialType] = useState<CredentialType>('onchain');

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
        <div>
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
                <Item title="Name" value={data.name} />
                <Item title="Revocable" value={data.revocable ? 'Yes' : 'No'} />
                <Item
                  title="Resolver"
                  value={isZeroAddress(data.resolver) ? 'None' : data.resolver}
                />
                <Item
                  title="Transaction"
                  value={`0x${data.tx}`}
                  link={`${tronNetworks.Shasta.scanner}/#/transaction/${data.tx}`}
                />
                <Item
                  title="Created By"
                  value={data.creator && tronweb.address.fromHex(data.creator)}
                  link={`${AppRouter.Address}/${data.creator}`}
                />
                <Item
                  title="Created At"
                  value={`${new Date(data.timestamp).toLocaleDateString()}  ${new Date(data.timestamp).toLocaleTimeString()} (${getRelativeTime(data.timestamp / 1000)})`}
                />
              </div>
              <div className="px-4 grow">
                <h1 className="text-lg font-semibold text-gray-600 mb-2">Schema</h1>
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
              <TabSwitch
                tabs={['onchain', 'offchain']}
                selectedTab={credentialType}
                className="!w-60 text-sm"
                onChange={(value) => {
                  setCredentialType(value as CredentialType);
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
