import { create } from 'zustand';

interface IEventState {
  txHash?: string;
  visible: boolean;
  open: (txHash: string) => void;
  close: () => void;
}

export const useTxResult = create<IEventState>((set) => ({
  txHash: undefined,
  visible: false,
  open: (txHash: string) => {
    set({ txHash, visible: true });
  },
  close: () => {
    set({ txHash: '', visible: false });
  },
}));
