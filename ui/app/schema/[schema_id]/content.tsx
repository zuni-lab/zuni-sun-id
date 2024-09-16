'use client';

import { Chip } from '@/components/builders/Chip';
import { buttonVariants } from '@/components/shadcn/Button';
import { useTronWeb } from '@/components/TronProvider';
import { AppRouter } from '@/constants/router';
import { useDetailSchema } from '@/hooks/useSchemas';
import { getRelativeTime, isZeroAddress } from '@/utils/tools';
import Link from 'next/link';

const RuleItem: IComponent<{
  type: string;
  name: string;
}> = ({ type, name }) => {
  return (
    <div className="flex gap-2 rounded-md overflow-hidden text-white">
      <div className="w-2/5 bg-gray-700 flex items-center px-4 font-medium uppercase">{type}</div>
      <div className="w-3/5 bg-primary p-2">
        <div className="text-white font-bold">{name}</div>
      </div>
    </div>
  );
};

export const DetailSchema: IComponent<{ schemaId: string }> = ({ schemaId }) => {
  const tronweb = useTronWeb();
  const { data } = useDetailSchema(schemaId as THexString);

  return (
    <div>
      {data ? (
        <section className="flex flex-col gap-4 mt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Chip text={`#${data.id}`} />
              <div className="font-bold ps-4">{data.uid}</div>
            </div>

            <Link className={buttonVariants()} href={`${AppRouter.Credential}/issue/${data.uid}`}>
              Issue Credential
            </Link>
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
      ) : (
        <div>Not Found</div>
      )}
    </div>
  );
};
