import { ReactNode } from 'react';

import { PopupLayout } from '@/components/layout/PopupLayout';

// 
export async function WrapperLayout({ children }: { children: ReactNode; locale: any }) {
  return (
    <div className="w-full h-full min-h-[80vh]">
      <PopupLayout>{children}</PopupLayout>
    </div>
  );
}
