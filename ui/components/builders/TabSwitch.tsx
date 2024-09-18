'use client';

import { Tabs, TabsList, TabsTrigger } from '@/shadcn/Tabs';

export const TabSwitch: IComponent<{
  tabs: string[];
  selectedTab?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}> = ({ onChange, tabs, selectedTab, disabled = false }) => {
  return (
    <Tabs value={selectedTab} onValueChange={onChange} className="w-[360px]">
      <TabsList className="grid w-full grid-cols-2 bg-red-50 rounded-2xl p-1.5 h-fit border">
        {tabs.map((t) => (
          <TabsTrigger
            disabled={disabled}
            key={t}
            value={t}
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white p-1.5 text-lg rounded-2xl duration-150">
            {t}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
