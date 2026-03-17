'use client';

import { useState } from 'react';

import { ProductCard } from '../components/cards/ProductCard';

export default function LandingPage() {
  const [featuredList] = useState<Array<number>>(() =>
    Array.from({ length: 8 }, (_, index) => index),
  );
  const [highlyRatedList] = useState<Array<number>>(() =>
    Array.from({ length: 8 }, (_, index) => index),
  );

  return (
    <div className="w-full flex flex-col">
      <style>
        {`
          @media (min-width: 1840px) {
            .fade-mask-large-screen {
              mask-image: linear-gradient(to right, transparent, black 400px, black calc(100% - 400px), transparent);
              -webkit-mask-image: linear-gradient(to right, transparent, black 400px, black calc(100% - 400px), transparent);
            }
          }
        `}
      </style>
      <div className="flex justify-center">
        <div className="w-[1840px] max-w-full h-[280px] my-60 px-10 flex gap-20 items-center no-scrollbar overflow-x-auto fade-mask-large-screen">
          {featuredList.map((index) => (
            <img
              key={index}
              src="https://shop.rosemont.ca/cdn/shop/products/mtndew_800x_f038c4c5-9adc-421f-a1b5-ea3f8c29980a.png?v=1627145543"
              className="w-60 shrink-0 aspect-square"
              alt="Beverage Product"
            />
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col gap-40">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <div className="w-[1560px] max-w-[calc(100%_-_160px)] h-20 flex items-center justify-between">
              <p>highly rated</p>
              <p className="hover:underline cursor-pointer">view all</p>
            </div>
          </div>
          <div className="px-[max(80px_,_calc((100%_-_1560px)_/_2))] grid grid-rows-2 grid-flow-col gap-x-10 no-scrollbar overflow-x-auto">
            {highlyRatedList.map((index) => (
              <ProductCard
                key={index}
                company="Company"
                product="Product"
                isFirstRow={index % 2 === 0}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-center">
            <div className="w-[1560px] max-w-[calc(100%_-_160px)] h-20 flex items-center justify-between">
              <p>newly added</p>
              <p className="hover:underline cursor-pointer">view all</p>
            </div>
          </div>
          <div className="px-[max(80px_,_calc((100%_-_1560px)_/_2))] grid grid-rows-2 grid-flow-col gap-x-10 no-scrollbar overflow-x-auto">
            {highlyRatedList.map((index) => (
              <ProductCard
                key={index}
                company="Company"
                product="Product"
                isFirstRow={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
