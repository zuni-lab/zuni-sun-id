import { toast, ToastOptions } from 'react-toastify';

const createToast = (msg: string, options?: ToastOptions) => () => toast(msg, options);

export const ToastTemplate = {
  Wallet: {
    NotFound: createToast('Wallet not found', { type: 'error' }),
    Disconnected: createToast('Wallet disconnected', { type: 'error' }),
    Unknown: createToast('Unknown error', { type: 'error' }),
  },
};
