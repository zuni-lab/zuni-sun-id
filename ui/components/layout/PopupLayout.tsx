import { TxResult } from '../builders/TxResult';

export const PopupLayout: IComponent = ({ children }) => {
  return (
    <>
      {children}
      <TxResult />
    </>
  );
};
