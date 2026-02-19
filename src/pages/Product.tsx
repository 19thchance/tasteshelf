import { useEffect, useState, useMemo, useRef } from 'react';
import { ProductCard } from '../components/cards/ProductCard';
import { ReviewCard } from '../components/cards/ReviewCard';

export interface Review {
  countryCode: string;
  date: Date;
  review: string;
  score: number;
}

export function Product() {
  // temp
  const [featuredList, setFeaturedList] = useState<Array<any>>([]);
  const [retailList, setRetailList] = useState<Array<any>>([]);
  const [featureList, setFeatureList] = useState<Array<any>>([]);
  const [reviewList, setReviewList] = useState<Review[]>([]);

  let regionNameList = new Intl.DisplayNames(['en'], { type: 'region' });

  useEffect(() => {
    setFeaturedList([0, 0, 0, 0]);
    setRetailList([0, 0, 0, 0]);
    setFeatureList([0, 0, 0, 0, 0, 0, 0, 0]);
    setReviewList([
      {
        countryCode: 'ad',
        date: new Date(),
        review:
          "This drink is honestly a disappointment from the first sip to the last. The flavor is weirdly artificial, like someone tried to recreate fruit using only chemicals and guesswork. It's way too sweet at first, then leaves a bitter aftertaste that just sits on your tongue.",
        score: 2,
      },
      {
        countryCode: 'ca',
        date: new Date(),
        review:
          "Back in my day, a drink was simple and actually tasted like what it claimed. This thing is just sugar and nonsense with a fancy label. Too sweet, strange flavor, and probably full of things you can't even pronounce. I'll stick to real drinks, thanks.",
        score: 10,
      },
      {
        countryCode: 'de',
        date: new Date(),
        review:
          'Es shmekt irgentwie komish und nich so wie auf der flashe. Ich dachte es is lecka aber es is zu süs und mein mund fühlt sich komich an. Meine freunde mochten das auch nich. Ich wil liba saft trinken.',
        score: 15,
      },
      {
        countryCode: 'kr',
        date: new Date(),
        review: '시발 존나맛없네',
        score: 0,
      },
      {
        countryCode: 'us',
        date: new Date(),
        review:
          'Tastes like sugary water with a chemical aftertaste. Not refreshing at all — feels like a waste of money after two sips.',
        score: 4,
      },
      {
        countryCode: 'us',
        date: new Date(),
        review:
          'Nah this drink is sketch as hell. Tastes fake af, like straight lab chemicals. You really expect me to believe this is "natural"? Yeah right. Big companies be putting random crap in here and hoping we\'re dumb. Shit left a weird film on my tongue too. I\'m not drinking that government juice.',
        score: 2,
      },
      {
        countryCode: 'kr',
        date: new Date(),
        review: '맛있는데 왜 다들 댓글에 욕하시는거죠;;',
        score: 82,
      },
      {
        countryCode: 'au',
        date: new Date(),
        review: 'tastes so ass',
        score: 11,
      },
      {
        countryCode: 'ca',
        date: new Date(),
        review:
          "Ugh I wanted to like it so bad because the bottle is kinda cute, but it's literally not giving. It tastes super fake and way too sweet, like... who actually drinks this? I took two sips and was done. I'll just stick to my iced matcha. 💅",
        score: 27,
      },
      {
        countryCode: 'ad',
        date: new Date(),
        review:
          "This drink is an abomination. It's like someone took a mediocre soda, added too much syrup, and called it a day. There's no balance of flavors, just a cloying sweetness that lingers way too long.",
        score: 6,
      },
      {
        countryCode: 'ad',
        date: new Date(),
        review:
          'This drink is surprisingly refreshing! It has a perfect balance of tartness and sweetness, leaving a pleasant zing on the palate. I can taste the natural ingredients and it feels like a burst of real fruit in every sip.',
        score: 98,
      },
    ]);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        // Calculate columns: (width + gap) / (minWidth + gap)
        // gap = 40px (gap-10)
        // minWidth = 280px
        const calculatedColumns = Math.floor((width + 40) / (280 + 40));

        setColumns(Math.max(1, Math.min(3, calculatedColumns)));
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const countryStats = useMemo(() => {
    const stats: Record<string, { totalScore: number; count: number }> = {};

    reviewList.forEach((review) => {
      const countryCode = review.countryCode.toLowerCase();

      if (!stats[countryCode]) {
        stats[countryCode] = { totalScore: 0, count: 0 };
      }

      stats[countryCode].totalScore += review.score;
      stats[countryCode].count += 1;
    });

    return Object.entries(stats)
      .map(([code, { totalScore, count }]) => ({
        code,
        average: Math.round(totalScore / count),
      }))
      .sort((a, b) => b.average - a.average);
  }, [reviewList]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full h-screen px-10">
        <div className="w-full flex justify-center">
          <div className="w-[1840px] max-w-[calc(100%_-_80px)] h-full absolute flex items-center justify-between">
            <div className="w-[360px] flex flex-col gap-5">
              <div className="overflow-hidden flex flex-col gap-1">
                <small className="block text-ellipsis overflow-hidden whitespace-nowrap">
                  Company
                </small>
                <p className="text-ellipsis overflow-hidden whitespace-nowrap group-hover:underline">
                  Product
                </p>
              </div>
              <p>
                This is a sample description text used only for layout and
                development purposes. It does not describe a specific product
                and may be replaced with actual content later. The goal of this
                text is to test spacing, alignment, and readability within the
                interface.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="w-[360px] max-h-[280px] px-5 flex flex-col bg-white border border-black no-scrollbar overflow-y-auto">
                <div className="sticky top-0 py-5">
                  <p>get it now</p>
                </div>
                <div className="w-full pb-5 flex flex-col">
                  {retailList.map((_, index) => (
                    <div
                      className="w-full py-5 flex items-center justify-between gap-5 shrink-0 group cursor-pointer"
                      key={index}
                    >
                      <div className="min-w-0 flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-1.5">
                          {/* temp */}
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4qAKcxM410O8K7y5UZy8VQ7JQaBZsm8uZRA&s"
                            className="w-4 h-4 rounded-full"
                            alt="Retail Store Logo"
                          />
                          <small className="text-ellipsis overflow-hidden whitespace-nowrap">
                            Company
                          </small>
                        </div>
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap group-hover:underline">
                          Retail Product
                        </p>
                      </div>
                      <p className="shrink-0">CA$3.99</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[360px] px-5 py-[19px] flex flex-col bg-white border border-black no-scrollbar overflow-y-auto">
                <div className="w-full h-full flex flex-col">
                  <div className="w-full h-10 flex items-center justify-between">
                    <p>release year</p>
                    <p>2000</p>
                  </div>
                  <div className="w-full h-10 flex items-center justify-between">
                    <p>calories</p>
                    <p>14.5cal/oz</p>
                  </div>
                  <div className="w-full h-10 flex items-center justify-between">
                    <p>
                      user score<span className="footnote">1</span>
                    </p>
                    <p>93</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full flex items-center justify-center">
          <img
            src="https://tr.rbxcdn.com/180DAY-18f5ddc9fab18e2ab000abfd89d3e00a/420/420/ShoulderAccessory/Webp/noFilter"
            className="h-[calc(100%_-_160px)] max-h-[720px] shrink-0 aspect-square"
            alt="Beverage Product"
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-40">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <div className="w-[1560px] max-w-[calc(100%_-_160px)] h-20 flex items-center justify-between">
              <p>similar to</p>
              <p className="hover:underline cursor-pointer">view all</p>
            </div>
          </div>
          <div className="px-[max(80px_,_calc((100%_-_1560px)_/_2))] grid grid-rows-1 grid-flow-col gap-x-10 no-scrollbar overflow-x-auto">
            {featuredList.map((_, index) => (
              <ProductCard key={index} firstRow />
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[1560px] max-w-[calc(100%_-_160px)] flex gap-10">
            <div className="w-[360px] flex flex-col gap-5">
              <div className="py-[19px] bg-white border border-black no-scrollbar overflow-x-auto">
                <div className="w-max h-10 px-5 flex items-center gap-5">
                  {featureList.map((_, index) => (
                    <p className="shrink-0" key={index}>
                      쌰갈!!!
                    </p>
                  ))}
                </div>
              </div>
              <div className="w-[360px] max-h-[280px] px-5 flex flex-col bg-white border border-black no-scrollbar overflow-y-auto">
                <div className="sticky top-0 py-5">
                  <p>by country</p>
                </div>
                <div className="w-full pb-5 flex flex-col">
                  {countryStats.map((stat, index) => (
                    <div
                      key={index}
                      className="w-full h-10 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img
                          src={`https://hatscripts.github.io/circle-flags/flags/${stat.code}.svg`}
                          className="w-[18px] h-[18px] shrink-0"
                          alt={stat.code}
                        />
                        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                          {regionNameList.of(stat.code.toUpperCase())}
                        </p>
                      </div>
                      <p>{stat.average}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col" ref={containerRef}>
              <div className="flex justify-center">
                <div className="w-full h-20 flex items-center justify-between">
                  <p>{reviewList.length} reviews</p>
                  <div className="flex gap-5">
                    <p className="underline cursor-pointer">all</p>
                    <p className="cursor-pointer">positive</p>
                    <p className="cursor-pointer">negative</p>
                  </div>
                </div>
              </div>
              <div
                className={`w-full grid gap-x-10 ${
                  columns === 3
                    ? 'grid-cols-3'
                    : columns === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-1'
                }`}
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div className="flex-1 flex flex-col" key={colIndex}>
                    {reviewList
                      .filter((_, i) => i % columns === colIndex)
                      .map((review, index) => (
                        <ReviewCard
                          key={index}
                          {...review}
                          firstRow={index === 0}
                        />
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
