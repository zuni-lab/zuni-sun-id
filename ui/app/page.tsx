import { RouterMeta } from '@/constants/router';
import { Metadata } from 'next';

export const metadata: Metadata = RouterMeta.Home;

export default function Page() {
  return <div>Home</div>;
}
