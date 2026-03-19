'use client';

import { LoopingTickerBase } from './LoopingTickerBase';

type ProductTickerItem = {
  alt: string;
  src: string;
};

type ProductTickerProps = {
  products: ProductTickerItem[];
};

export function ProductTicker({ products }: ProductTickerProps) {
  return (
    <LoopingTickerBase
      items={products}
      getItemKey={(product, index) => `${index}-${product.src}`}
      emptyState={<div className="w-[360px] p-5 bg-white border border-black" />}
      containerClassName="w-[360px] p-5 bg-white border border-black no-scrollbar overflow-x-auto"
      trackClassName="w-max flex items-center will-change-transform"
      copyTrackClassName="flex items-center gap-5 shrink-0 pr-5"
      renderItem={(product) => (
        <img
          src={product.src}
          className="w-[60px] shrink-0 aspect-square cursor-pointer"
          alt={product.alt}
        />
      )}
    />
  );
}
