"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 댓글 개수는 Comments가 이미 불러온 값을 이벤트로 흘려보낸다.
// 도크가 같은 쿼리를 한 번 더 날리지 않게 하려는 것.
export const COMMENT_COUNT_EVENT = "comments:count";

export function publishCommentCount(count: number) {
  window.dispatchEvent(new CustomEvent(COMMENT_COUNT_EVENT, { detail: count }));
}

// 스크롤 진행률과 "도크를 띄울 만큼 내려왔는지"를 한 리스너에서 같이 구한다.
function useReading() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setProgress(max <= 0 ? 1 : Math.min(1, Math.max(0, y / max)));
      setScrolled(y > 200);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { progress, scrolled };
}

const RING_R = 9;
const RING_C = 2 * Math.PI * RING_R;

const itemClass =
  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100 transition-colors";

export const ReadingDock = () => {
  const { progress, scrolled } = useReading();
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | null>(null);

  useEffect(() => {
    const onCount = (e: Event) =>
      setCommentCount((e as CustomEvent<number>).detail);
    window.addEventListener(COMMENT_COUNT_EVENT, onCount);
    return () => window.removeEventListener(COMMENT_COUNT_EVENT, onCount);
  }, []);

  useEffect(() => {
    return () => {
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    };
  }, []);

  const toTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toComments = useCallback(() => {
    document
      .getElementById("comments")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const share = useCallback(async () => {
    const url = window.location.href;
    // 모바일에서는 네이티브 공유 시트가 자연스럽고, 데스크톱에서는 복사가 예측 가능하다.
    const useSheet =
      typeof navigator.share === "function" &&
      window.matchMedia("(pointer: coarse)").matches;

    if (useSheet) {
      try {
        await navigator.share({ title: document.title, url });
      } catch {
        // 공유 시트를 사용자가 닫은 경우. 복사로 넘어가지 않는다.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // 클립보드 권한이 없는 브라우저. 조용히 넘어간다.
    }
  }, []);

  return (
    <div
      aria-hidden={!scrolled}
      className={`fixed bottom-5 left-1/2 z-50 flex items-center gap-0.5 rounded-full border border-slate-300/60 dark:border-slate-700/70 bg-[var(--bg-elev)]/90 backdrop-blur px-1 py-1 text-xs shadow-sm transition-all duration-300 ease-out ${
        scrolled
          ? "-translate-x-1/2 translate-y-0 opacity-100"
          : "-translate-x-1/2 translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={toTop}
        title="맨 위로"
        aria-label={`맨 위로 (${Math.round(progress * 100)}% 읽음)`}
        className="group relative flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0 h-8 w-8 -rotate-90"
          aria-hidden
        >
          <circle
            cx="12"
            cy="12"
            r={RING_R}
            fill="none"
            strokeWidth="2"
            className="stroke-slate-300/70 dark:stroke-slate-700"
          />
          <circle
            cx="12"
            cy="12"
            r={RING_R}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - progress)}
            className="stroke-slate-600 dark:stroke-slate-200"
          />
        </svg>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative"
          aria-hidden
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>

      <span
        aria-hidden
        className="mx-0.5 h-3 w-px bg-slate-300/70 dark:bg-slate-700/80"
      />

      <button type="button" onClick={toComments} className={itemClass}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
        </svg>
        <span>댓글{commentCount ? ` ${commentCount}` : ""}</span>
      </button>

      <button
        type="button"
        onClick={share}
        className={itemClass}
        aria-live="polite"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <span>{copied ? "복사됨" : "공유"}</span>
      </button>
    </div>
  );
};
