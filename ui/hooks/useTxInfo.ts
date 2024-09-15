import { ProjectENV } from '@env';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const useTxInfo = (txHash: string | undefined, maxRetries: number) => {
  const [count, setCount] = useState(0);

  const {
    data: txInfo,
    isLoading: isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['events', txHash],
    queryFn: async () => {
      setCount((c) => c + 1);
      return await fetch(
        `${ProjectENV.NEXT_PUBLIC_TRON_PROVIDER}/walletsolidity/gettransactioninfobyid`,
        {
          method: 'POST',
          body: JSON.stringify({ value: txHash }),
        }
      ).then((res) => res.json());
    },
    refetchInterval: 5000,
    enabled: !!txHash && count < maxRetries,
  });

  const isLoading = isFetching || (count < maxRetries && !txInfo?.id);

  return { txInfo, isLoading, isError, error, count };
};
