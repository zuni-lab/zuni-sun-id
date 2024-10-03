import { MOCK_STATS } from '@/constants/mock';
import { RouterMeta } from '@/constants/router';
import { Metadata } from 'next';
import { Credentials } from './components/Credentials';
import { RecentSchemas } from './components/RecentSchemas';

export const metadata: Metadata = RouterMeta.Home;

export default function Page() {
  return (
    <main className="py-12 space-y-20">
      <div className="flex items-center gap-12">
        <section className="grow flex items-center justify-around gap-4 divide-x divide-white py-12 max-w-7xl !bg-white shadow-none">
          {MOCK_STATS.map((stat, i) => (
            <div className="px-4 text-center" key={i}>
              <h3 className="text-xl font-semibold">{stat.value}</h3>
              <p className="text-lg text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </section>
      </div>
      <Credentials title="Recent Onchain Credentials" credentialType="onchain" />
      <Credentials title="Recent Offchain Credentials" credentialType="offchain" />
      <RecentSchemas />
    </main>
  );
}
