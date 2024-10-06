import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { useTronWeb } from '@/components/TronProvider';
import { EventQuery } from '@/tron/query';

export const useTxInfo = <T>(txHash: string | undefined, maxRetries: number) => {
  const [count, setCount] = useState(0);
  const tronWeb = useTronWeb();

  const {
    data: txInfo,
    isLoading: isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['events', txHash],
    queryFn: async () => {
      setCount((c) => c + 1);
      const events = await EventQuery.getEventsByTransactionID<T>(tronWeb, txHash as string);
      setCount(0);
      return events[0];
    },
    refetchInterval: 2000,
    enabled: !!txHash && count < maxRetries,
  });

  const isLoading = isFetching || (count < maxRetries && !txInfo?.transaction);

  return { txInfo, isLoading, isError, error, count };
};
