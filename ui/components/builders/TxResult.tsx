'use client';

import { SchemaKeys } from '@/app/schema/config';
import { useTxResult } from '@/states/useTxResult';
import { EventQuery } from '@/tron/events';
import { cx } from '@/utils/tools';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../shadcn/Dialog';

export const TxResult: IComponent = () => {
  const { visible, txHash, close } = useTxResult();
  const [count, setCount] = useState(0);
  const queryClient = useQueryClient();

  const {
    data: events,
    isLoading: isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['events', txHash],
    queryFn: async () => {
      setCount((c) => c + 1);
      return await EventQuery.getEventsByTransactionID(txHash!);
    },
    refetchInterval: 5000,
    enabled: !!txHash && count < 5,
  });

  const isLoading = isFetching || (count < 5 && (!events || events.length === 0));

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [SchemaKeys.Event],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={visible}>
      <DialogContent
        // className="bg-white text-accent min-w-[400px] max-w-4xl min-h-32 max-h-80"
        className={cx('bg-white text-accent  max-w-4xl min-h-32 max-h-80', {
          'w-[400px]': isLoading,
        })}
        onClose={close}>
        <DialogHeader>
          <DialogTitle>
            {isLoading ? 'Loading events' : isError ? 'Error loading events' : 'Events'}
          </DialogTitle>
          <DialogDescription>
            {isLoading && (
              <span>
                <Loader className="w-12 h-12 text-background animate-spin m-auto mt-2" />
              </span>
            )}
            {!isLoading && (
              <>
                {isError && (
                  <p>Failed to load events for this transaction. Error: {error.message}</p>
                )}
                {!events ||
                  (events.length === 0 && (
                    <div className="my-4 space-y-2">
                      <p className="text-destructive">No events found for this transaction.</p>
                      <p>Transaction hash: #{txHash}</p>
                    </div>
                  ))}
                {events && events.length ? (
                  <ul className="list-none p-0 w-full">
                    {events.map((event, index) => (
                      <li
                        key={index}
                        className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4 shadow-sm space-y-4 mt-4">
                        <p>
                          <strong>Transaction:</strong> #{event.transaction}
                        </p>
                        <p>
                          <strong>Block:</strong> {event.block}
                        </p>
                        <p>
                          <strong>Contract:</strong> {event.contract}
                        </p>
                        <p>
                          <strong>Name:</strong> {event.name}
                        </p>
                        <p>
                          <strong>Timestamp:</strong> {new Date(event.timestamp).toDateString()} -{' '}
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>

                        {/* <p className="truncate" title={JSON.stringify(event.result)}>
                     <strong>Result:</strong> {JSON.stringify(event.result)}
                   </p> */}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
