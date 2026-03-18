'use client';

import {
  motion,
  type MotionValue,
  useAnimationFrame,
  useMotionValue,
} from 'motion/react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
} from 'react';

const AUTO_SCROLL_SPEED = 28;
const AUTO_SCROLL_TRANSITION_MS = 200;
const MIN_REPEAT_COUNT = 5;
const EXTRA_REPEAT_BUFFER = 4;
const MANUAL_SCROLL_IDLE_MS = 120;

type TagTickerProps = {
  tags: string[];
};

type LoopMetrics = {
  container: HTMLDivElement;
  baseWidth: number;
  repeatCount: number;
};

type AutoScrollSpeedTransition = {
  from: number;
  onComplete: (() => void) | null;
  startTimestamp: number | null;
  to: number;
};

const buildCopyIndexes = (repeatCount: number) => {
  return Array.from({ length: repeatCount }, (_, index) => index);
};

const getShiftCopies = (repeatCount: number) => {
  return Math.max(1, Math.floor(repeatCount / 2));
};

const getLoopShift = (baseWidth: number, repeatCount: number) => {
  return baseWidth * getShiftCopies(repeatCount);
};

const getRepeatCount = (containerWidth: number, baseWidth: number) => {
  return Math.max(
    MIN_REPEAT_COUNT,
    Math.ceil(containerWidth / baseWidth) + EXTRA_REPEAT_BUFFER,
  );
};

const normalizeLoopScrollPosition = ({
  container,
  baseWidth,
  repeatCount,
}: LoopMetrics) => {
  const minScrollLeft = baseWidth;
  const maxScrollLeft = baseWidth * (repeatCount - 2);

  if (
    container.scrollLeft >= minScrollLeft &&
    container.scrollLeft < maxScrollLeft
  ) {
    return;
  }

  const centeredScrollLeft = getLoopShift(baseWidth, repeatCount);
  const normalizedOffset =
    ((container.scrollLeft % baseWidth) + baseWidth) % baseWidth;

  container.scrollLeft = centeredScrollLeft + normalizedOffset;
};

const resetAutoScrollOffset = (
  x: MotionValue<number>,
  autoOffsetRef: MutableRefObject<number>,
) => {
  autoOffsetRef.current = 0;
  x.set(0);
};

const easeInOut = (progress: number) => {
  return 0.5 - Math.cos(Math.PI * progress) / 2;
};

export function TagTicker({ tags }: TagTickerProps) {
  const x = useMotionValue(0);

  const [repeatCount, setRepeatCount] = useState(MIN_REPEAT_COUNT);
  const [isReady, setIsReady] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const baseTrackRef = useRef<HTMLDivElement>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const hoveredRef = useRef(false);
  const manualScrollActiveRef = useRef(false);
  const initializedRef = useRef(false);
  const baseWidthRef = useRef(0);
  const repeatCountRef = useRef(MIN_REPEAT_COUNT);
  const autoOffsetRef = useRef(0);
  const autoScrollSpeedRef = useRef(0);
  const autoScrollStartedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speedTransitionRef = useRef<AutoScrollSpeedTransition | null>(null);

  const clearResumeTimeout = () => {
    if (!resumeTimeoutRef.current) {
      return;
    }

    clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = null;
  };

  const normalizeScrollPosition = () => {
    const container = scrollContainerRef.current;
    const baseWidth = baseWidthRef.current;

    if (!container || !baseWidth) {
      return;
    }

    normalizeLoopScrollPosition({
      container,
      baseWidth,
      repeatCount: repeatCountRef.current,
    });
  };

  const startAutoScrollSpeedTransition = (
    to: number,
    onComplete: (() => void) | null = null,
  ) => {
    const from = autoScrollSpeedRef.current;

    if (Math.abs(from - to) < 0.001) {
      autoScrollSpeedRef.current = to;
      speedTransitionRef.current = null;
      onComplete?.();

      return;
    }

    speedTransitionRef.current = {
      from,
      onComplete,
      startTimestamp: null,
      to,
    };
  };

  const resumeAutoScroll = () => {
    clearResumeTimeout();

    normalizeScrollPosition();
    manualScrollActiveRef.current = false;
    lastTimestampRef.current = null;
    startAutoScrollSpeedTransition(1);
    autoScrollStartedRef.current = true;
  };

  const activateManualScroll = () => {
    const container = scrollContainerRef.current;
    const autoOffset = autoOffsetRef.current;

    clearResumeTimeout();

    if (manualScrollActiveRef.current) {
      return;
    }

    manualScrollActiveRef.current = true;
    resetAutoScrollOffset(x, autoOffsetRef);

    if (!container || !autoOffset) {
      return;
    }

    container.scrollLeft += autoOffset;
    normalizeScrollPosition();
  };

  const scheduleAutoScrollResume = () => {
    clearResumeTimeout();

    if (hoveredRef.current) {
      return;
    }

    resumeTimeoutRef.current = setTimeout(() => {
      if (hoveredRef.current) {
        return;
      }

      resumeAutoScroll();
    }, MANUAL_SCROLL_IDLE_MS);
  };

  useLayoutEffect(() => {
    initializedRef.current = false;
    hoveredRef.current = false;
    manualScrollActiveRef.current = false;
    lastTimestampRef.current = null;
    autoScrollSpeedRef.current = 0;
    autoScrollStartedRef.current = false;
    speedTransitionRef.current = null;
    resetAutoScrollOffset(x, autoOffsetRef);
    clearResumeTimeout();

    setIsReady(false);
  }, [tags]);

  useEffect(() => {
    repeatCountRef.current = repeatCount;
  }, [repeatCount]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    const baseTrack = baseTrackRef.current;

    if (!container || !baseTrack || !tags.length) {
      return;
    }

    const syncLayout = () => {
      const baseWidth = baseTrack.getBoundingClientRect().width;
      const containerWidth = container.clientWidth;

      if (!baseWidth || !containerWidth) {
        return;
      }

      baseWidthRef.current = baseWidth;

      const nextRepeatCount = getRepeatCount(containerWidth, baseWidth);

      if (nextRepeatCount !== repeatCount) {
        setRepeatCount(nextRepeatCount);

        return;
      }

      if (!initializedRef.current) {
        container.scrollLeft = getLoopShift(baseWidth, repeatCount);
        initializedRef.current = true;
      } else {
        normalizeScrollPosition();
      }

      setIsReady(true);
    };

    syncLayout();

    const observer = new ResizeObserver(syncLayout);

    observer.observe(container);
    observer.observe(baseTrack);

    return () => observer.disconnect();
  }, [repeatCount, tags.length]);

  useEffect(() => {
    if (!isReady || autoScrollStartedRef.current || manualScrollActiveRef.current) {
      return;
    }

    resumeAutoScroll();
  }, [isReady]);

  useEffect(() => {
    return () => clearResumeTimeout();
  }, []);

  useAnimationFrame((timestamp) => {
    const speedTransition = speedTransitionRef.current;

    if (speedTransition) {
      if (speedTransition.startTimestamp === null) {
        speedTransition.startTimestamp = timestamp;
      }

      const progress = Math.min(
        1,
        (timestamp - speedTransition.startTimestamp) / AUTO_SCROLL_TRANSITION_MS,
      );

      autoScrollSpeedRef.current =
        speedTransition.from +
        (speedTransition.to - speedTransition.from) * easeInOut(progress);

      if (progress >= 1) {
        const onComplete = speedTransition.onComplete;

        autoScrollSpeedRef.current = speedTransition.to;
        speedTransitionRef.current = null;
        onComplete?.();
      }
    }

    if (!isReady || manualScrollActiveRef.current) {
      lastTimestampRef.current = timestamp;

      return;
    }

    const baseWidth = baseWidthRef.current;

    if (!baseWidth) {
      return;
    }

    const previousTimestamp = lastTimestampRef.current ?? timestamp;
    const delta = timestamp - previousTimestamp;

    lastTimestampRef.current = timestamp;

    autoOffsetRef.current =
      (autoOffsetRef.current +
        (AUTO_SCROLL_SPEED * autoScrollSpeedRef.current * delta) / 1000) %
      baseWidth;

    x.set(-autoOffsetRef.current);
  });

  const enterManualScrollMode = () => {
    hoveredRef.current = true;
    clearResumeTimeout();

    if (manualScrollActiveRef.current) {
      return;
    }

    startAutoScrollSpeedTransition(0, activateManualScroll);
  };

  if (!tags.length) {
    return <div className="py-5 bg-white border border-black" />;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="py-5 bg-white border border-black no-scrollbar overflow-x-auto"
      style={{ visibility: isReady ? 'visible' : 'hidden' }}
      onMouseEnter={enterManualScrollMode}
      onMouseLeave={() => {
        hoveredRef.current = false;
        scheduleAutoScrollResume();
      }}
      onScroll={() => {
        if (!manualScrollActiveRef.current) {
          return;
        }

        normalizeScrollPosition();
        scheduleAutoScrollResume();
      }}
    >
      <motion.div
        className="w-max pl-5 flex items-center will-change-transform"
        style={{ x }}
      >
        {buildCopyIndexes(repeatCount).map((copyIndex) => (
          <div
            key={copyIndex}
            ref={copyIndex === 0 ? baseTrackRef : undefined}
            className="h-10 pr-5 flex items-center gap-5 shrink-0"
          >
            {tags.map((tag, tagIndex) => (
              <p className="shrink-0" key={`${copyIndex}-${tagIndex}`}>
                {tag}
              </p>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
