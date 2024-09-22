import { toast, ToastOptions } from 'react-toastify';

const createToast = (msg: string, options?: ToastOptions) => () => toast(msg, options);

export const ToastTemplate = {
  Wallet: {
    NotFound: createToast('Wallet not found', { type: 'error' }),
    Disconnected: createToast('Wallet disconnected', { type: 'error' }),
    Unknown: createToast('Unknown error', { type: 'error' }),
    Message: (msg: string) => createToast(msg, { type: 'warning' })(),
  },
  Schema: {
    Submit: createToast('Schema submitted successfully', { type: 'success' }),
    SubmitError: createToast('Failed to submit the schema', { type: 'error' }),
  },
  Credential: {
    SubmitError: createToast('Failed to submit the credential', { type: 'error' }),
    SubmitOnChain: createToast("You have submitted the credential. It's now on-chain.", {
      type: 'success',
    }),
    SubmitOffChain: createToast("You have submitted the credential. It's now off-chain.", {
      type: 'success',
    }),
  },
};
