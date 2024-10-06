import { create } from 'zustand';

type OffchainTxResult = {
  uid: string;
  cid: string;
  schema_uid: string;
};

interface IEventState {
  visible: boolean;
  txResultType?: TxResultType;
  offchainResult?: OffchainTxResult;
  txHash?: string;
  open: (txHash: string, txResultType?: TxResultType, offchainResult?: OffchainTxResult) => void;
  close: () => void;
}

export const useTxResult = create<IEventState>((set) => ({
  visible: false,
  txResultType: undefined,
  txHash: undefined,
  offchainResult: undefined,
  open: (txHash: string, txResultType?: TxResultType, offchainResult?: OffchainTxResult) => {
    set({ txHash, visible: true, txResultType, offchainResult });
  },
  close: () => {
    set({ txHash: '', visible: false });
  },
}));
