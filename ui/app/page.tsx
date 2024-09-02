import { RouterMeta } from '@/constants/router';
import { Metadata } from 'next';

export const metadata: Metadata = RouterMeta.Home;

export default function HomePage() {
  return <div>HOME</div>;
}
