import { Metadata } from 'next';

import { RouterMeta } from '@/constants/router';

import { SchemaList } from './SchemaList';

export const metadata: Metadata = RouterMeta.Schemas;

export default function Page() {
  return (
    <main className="py-16">
      <SchemaList />
    </main>
  );
}
