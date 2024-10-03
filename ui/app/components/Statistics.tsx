'use client';

import { useCountCredentials, useCountCredentialsAddresses } from '@/hooks/useCredentials';
import { useCountSchemas } from '@/hooks/useSchemas';

export const Statistics: IComponent = () => {
  const { data: totalSchemas } = useCountSchemas();
  const { data: totalOnchainCredentials } = useCountCredentials({ credentialType: 'onchain' });
  const { data: totalOffchainCredentials } = useCountCredentials({ credentialType: 'offchain' });
  const { data: totalUsers } = useCountCredentialsAddresses();

  const stats = [
    {
      label: 'Total Schemas',
      value: totalSchemas,
    },
    {
      label: 'Onchain Credentials',
      value: totalOnchainCredentials,
    },
    {
      label: 'Offchain Credentials',
      value: totalOffchainCredentials,
    },
    {
      label: 'Active Users',
      value: totalUsers,
    },
  ];

  return (
    <div className="flex items-center gap-12">
      <section className="grow flex items-center justify-around gap-4 divide-x divide-white py-12 max-w-7xl !bg-white shadow-none">
        {stats.map((stat, i) => (
          <div className="px-4 text-center" key={i}>
            <h3 className="text-xl font-semibold">{stat.value}</h3>
            <p className="text-lg text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
