'use client';

import { LoopingTickerBase } from './LoopingTickerBase';

type TagTickerProps = {
  tags: string[];
};

export function TagTicker({ tags }: TagTickerProps) {
  return (
    <LoopingTickerBase
      items={tags}
      getItemKey={(tag, index) => `${index}-${tag}`}
      emptyState={<div className="py-5 bg-white border border-black" />}
      containerClassName="py-5 bg-white border border-black no-scrollbar overflow-x-auto"
      trackClassName="w-max pl-5 flex items-center will-change-transform"
      copyTrackClassName="h-10 pr-5 flex items-center gap-5 shrink-0"
      renderItem={(tag) => <p className="shrink-0">{tag}</p>}
    />
  );
}
