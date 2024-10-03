'use client';

import { CredentialRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { buttonVariants } from '@/components/shadcn/Button';
import { AppRouter } from '@/constants/router';
import Link from 'next/link';
import { CredentialTableHeaders } from '../../constants/table';
import useCredentials from '@/hooks/useCredentials';
import { ITEMS_PER_PAGE } from '@/constants/configs';

export const RecentCredentials: IComponent<{
  credentialType: CredentialType;
}> = ({ credentialType }) => {
  const { items, isFetching } = useCredentials({
    page: 1,
    limit: ITEMS_PER_PAGE.HOME,
    credentialType,
  });

  return (
    <SunTable
      title={`Recent ${credentialType} Credentials`}
      columns={CredentialTableHeaders}
      items={items ?? []}
      isLoading={isFetching}
      button="credential"
      renderRow={CredentialRow}
      footerButton={
        <Link
          className={buttonVariants({
            variant: 'link',
            className: 'w-full',
          })}
          href={AppRouter.Credentials}>
          View all Credential
        </Link>
      }
    />
  );
};
