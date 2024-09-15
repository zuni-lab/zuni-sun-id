'use client';

import { useDetailSchema } from '@/hooks/useSchemas';
import { Loader } from 'lucide-react';
import { notFound } from 'next/navigation';
import { IssueCredentialForm } from '../components/IssueForm';

export const IssuePage: IComponent<{
  schemaId: THexString;
}> = ({ schemaId }) => {
  const { data, isFetching, isError } = useDetailSchema(schemaId);

  if (isFetching)
    return (
      <div className="h-20vh w-screen flex items-center justify-center py-12">
        <Loader className="animate-spin" size="40" />
      </div>
    );

  if (!isFetching && (isError || !data)) {
    notFound();
  }

  return (
    <section className="mt-4 max-w-4xl">
      {!isFetching && !isError && data && <IssueCredentialForm data={data} />}
    </section>
  );
};
