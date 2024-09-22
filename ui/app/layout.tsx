import './global.scss';

import { Metadata } from 'next';
import { Nunito, Roboto_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProgressBarClient from '@/components/ProgressBar';
import { TransitionLayout } from '@/layouts/TransitionLayout';

import Providers from './provider';
import { WrapperLayout } from './wrapper';
import { WrapperClientLayout } from './wrapper-client';

export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'vi-VN' }];
}

const nunito = Nunito({ subsets: ['latin'] });

const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--mono-font' });

export const conthrax = localFont({
  src: '../public/font/conthrax.otf',
  variable: '--conthrax-font',
});

export const metadata: Metadata = {
  description: 'Bridging Real-Life Data and Blockchain on Tron 🌞',
  icons: '/favicon.ico',
  title: 'SunID',
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: TAny;
}) {
  return (
    <html lang={params.lang}>
      <body className={`${nunito.className} ${conthrax.variable} ${robotoMono.variable}`}>
        <Suspense>
          <ProgressBarClient />
          <ToastContainer position="bottom-right" newestOnTop />
        </Suspense>
        <Providers>
          <WrapperClientLayout>
            <WrapperLayout locale={params.lang}>
              <TransitionLayout>{children}</TransitionLayout>
            </WrapperLayout>
          </WrapperClientLayout>
        </Providers>
      </body>
    </html>
  );
}
