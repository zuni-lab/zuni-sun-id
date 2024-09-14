'use client';

import { ClaimRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { buttonVariants } from '@/components/shadcn/Button';
import { MOCK_CLAIMS } from '@/constants/mock';
import { AppRouter } from '@/constants/router';
import Link from 'next/link';
import { CredentialTableHeaders } from '../../constants/table';

export const RecentCredentials: IComponent = () => {
  return (
    <SunTable
      title="Recent Credentials"
      columns={CredentialTableHeaders}
      items={MOCK_CLAIMS}
      renderRow={ClaimRow}
      footerButton={
        <Link
          className={buttonVariants({
            variant: 'link',
            className: 'w-full',
          })}
          href={AppRouter.Credential}>
          View all Credential
        </Link>
      }
    />
  );
};
