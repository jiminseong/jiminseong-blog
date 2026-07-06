"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <div className="container mx-auto px-5">
        <section className="mt-24 mb-32 text-center">
          <p className="text-2xl font-bold tracking-tight mb-4">문제가 발생했습니다.</p>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            잠시 후 다시 시도해 주세요.
          </p>
          <button
            onClick={reset}
            className="inline-block px-4 py-2 rounded-full border border-slate-300/60 text-sm text-slate-600 hover:border-slate-400/70 dark:border-slate-700/70 dark:text-slate-300 dark:hover:border-slate-500 transition-colors"
          >
            다시 시도
          </button>
        </section>
      </div>
    </main>
  );
}
