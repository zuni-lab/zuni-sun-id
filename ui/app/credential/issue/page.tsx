import { Metadata } from 'next';

import { SchemaList } from '@/app/schema/SchemaList';

export const metadata: Metadata = {
  title: 'Create Credential | SunID',
  description: 'Create a new credential',
};

export default function Page() {
  return (
    <section className="py-16">
      <div className="text-center text-2xl font-semibold">Choose a schema to issue credential</div>
      <SchemaList />
    </section>
  );
}
