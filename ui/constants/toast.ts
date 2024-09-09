import { toast, ToastOptions } from 'react-toastify';

const createToast = (msg: string, options?: ToastOptions) => () => toast(msg, options);

export const ToastTemplate = {
  Wallet: {
    NotFound: createToast('Wallet not found', { type: 'error' }),
    Disconnected: createToast('Wallet disconnected', { type: 'error' }),
    Unknown: createToast('Unknown error', { type: 'error' }),
  },
  Schema: {
    Submit: (tx: string) =>
      createToast(
        'You have subbmitted the new schema. Please wait for the on-chain transaction to be confirmed.\n' +
          'Transaction hash: ' +
          tx,
        { type: 'success' }
      ),
    SubmitError: createToast('Failed to submit the schema', { type: 'error' }),
  },
};
