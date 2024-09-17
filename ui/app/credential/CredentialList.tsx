'use client';

import { CredentialRow } from '@/components/builders/RenderRow';
import { SunTable } from '@/components/builders/SunTable';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import useCredentials, { useCountCredentials } from '@/hooks/useCredentials';
import { useState } from 'react';
import { CredentialTableHeaders } from '../../constants/table';

export const CredentialList: IComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: totalCredentials } = useCountCredentials();

  const { items, isFetching } = useCredentials({
    page: currentPage,
    limit: ITEMS_PER_PAGE.CREDENTIAL,
  });

  return (
    <SunTable
      title="List of credentials"
      columns={CredentialTableHeaders}
      items={items ?? []}
      isLoading={isFetching}
      renderRow={CredentialRow}
      maxItems={ITEMS_PER_PAGE.CREDENTIAL}
      pagination={{
        currentPage: currentPage,
        totalItems: totalCredentials,
        onPageChange: (page) => setCurrentPage(page),
      }}
    />
  );
};
