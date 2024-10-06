'use client';

import { useState } from 'react';

import { CredentialRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import useCredentials from '@/hooks/useCredentials';

import { CredentialTableHeaders } from '../../constants/table';

export const Credentials: IComponent<{
  title: string;
  credentialType: CredentialType;
  displayButton?: boolean;
}> = ({ title, credentialType, displayButton = true }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { items, isFetching, total } = useCredentials({
    page: currentPage,
    limit: ITEMS_PER_PAGE.HOME,
    credentialType,
  });

  return (
    <SunTable
      title={title}
      columns={CredentialTableHeaders}
      items={items ?? []}
      isLoading={isFetching}
      renderRow={CredentialRow}
      maxItems={ITEMS_PER_PAGE.CREDENTIAL}
      pagination={{
        currentPage: currentPage,
        totalItems: total ?? 0,
        onPageChange: (page) => setCurrentPage(page),
      }}
      button={displayButton ? 'credential' : 'none'}
    />
  );
};
