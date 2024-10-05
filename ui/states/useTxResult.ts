import { create } from 'zustand';

interface IEventState {
  txResultType?: TxResultType;
  txHash?: string;
  visible: boolean;
  open: (txHash: string, txResultType?: TxResultType) => void;
  close: () => void;
}

export const useTxResult = create<IEventState>((set) => ({
  txResultType: undefined,
  txHash: undefined,
  visible: false,
  open: (txHash: string, txResultType?: TxResultType) => {
    set({ txHash, visible: true, txResultType });
  },
  close: () => {
    set({ txHash: '', visible: false });
  },
}));
