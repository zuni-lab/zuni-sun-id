import { useState } from 'react';

import { TabSwitch } from './TabSwitch';

export const CredentialTypeSwitch: IComponent<{
  credentialType: CredentialType;
  setCredentialType: (credentialType: CredentialType) => void;
}> = ({ credentialType, setCredentialType }) => {
  return (
    <TabSwitch
      tabs={['onchain', 'offchain']}
      selectedTab={credentialType}
      className="!w-60 text-sm"
      onChange={(credentialType) => setCredentialType(credentialType as CredentialType)}
    />
  );
};

export const useCredentialType = () => {
  const [credentialType, setCredentialType] = useState<CredentialType>('onchain');
  return { credentialType, setCredentialType };
};
