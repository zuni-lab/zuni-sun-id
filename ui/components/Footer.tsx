'use client';

import Link from 'next/link';

import { AppRouter } from '@/constants/router';

export const Logo: IComponent = () => {
  return (
    <svg
      width="171"
      height="28"
      viewBox="0 0 684 224"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink">
      <rect width="684" height="224" fill="url(#pattern0_6_2)" />
      <defs>
        <pattern id="pattern0_6_2" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_6_2" transform="matrix(0.00146199 0 0 0.00446429 -0.461988 0)" />
        </pattern>
        <image
          id="image0_6_2"
          width="1000"
          height="224"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export const Footer: IComponent = () => {
  return (
    <footer className="bg-red-700 px-20 py-8 mt-20 text-white flex items-center justify-between">
      <div>
        <Logo />
      </div>
      <div className="text-center md:text-left">
        <p>© {new Date().getFullYear()} SunID. All Rights Reserved.</p>
      </div>
      <div className="flex flex-col gap-4">
        <a
          className="text-white flex gap-2 items-center hover:underline"
          target="_blank"
          href="https://github.com/orgs/zuni-lab">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-github">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          Github
        </a>
        <Link
          href={`${AppRouter.Docs}`}
          className="text-white flex gap-2 items-center hover:underline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-book">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Documentation
        </Link>
      </div>
    </footer>
  );
};
