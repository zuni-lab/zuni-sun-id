'use client';

import { useTxResult } from '@/states/useTxResult';
import { EventQuery } from '@/tron/events';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../shadcn/Dialog';

export const TxResult: IComponent = () => {
  const { visible, txHash, close } = useTxResult();

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['events', txHash],
    queryFn: async () => {
      return await EventQuery.getEventsByTransactionID(txHash!);
    },
    enabled: !!txHash,
  });

  if (isLoading) {
    return <Loader className="w-4 h-4 text-background animate-spin" />;
  }

  return (
    <Dialog open={visible}>
      <DialogContent className="bg-white text-accent max-w-4xl max-h-80" onClose={close}>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            {isError && <p>Failed to load events for this transaction. Error: {error.message}</p>}
            {!events || (events.length === 0 && <p>No events found for this transaction.</p>)}
            {events && events.length ? (
              <ul className="list-none p-0 w-full">
                {events.map((event, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4 shadow-sm space-y-4 mt-4">
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
                      <strong>Timestamp:</strong> {new Date(event.timestamp).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Transaction:</strong> {event.transaction}
                    </p>
                    {/* <p className="truncate" title={JSON.stringify(event.result)}>
                     <strong>Result:</strong> {JSON.stringify(event.result)}
                   </p> */}
                  </li>
                ))}
              </ul>
            ) : null}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
