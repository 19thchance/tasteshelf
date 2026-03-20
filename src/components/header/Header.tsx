'use client';

import { useRouter } from 'next/navigation';

import { ListingControl } from './ListingControl';
import { SearchControl } from './SearchControl';

export function Header() {
  const router = useRouter();

  return (
    <div className="flex justify-center pointer-events-none">
      <div className="w-[1840px] max-w-[calc(100%_-_80px)] h-20 fixed flex items-center justify-between z-20">
        <SearchControl />
        <p
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer pointer-events-auto"
          onClick={() => router.push('/')}
        >
          tasteshelf.com
        </p>
        <ListingControl />
      </div>
    </div>
  );
}
