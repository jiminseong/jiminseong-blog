"use client";

import { useEffect, useState } from "react";

type AuthError = {
  title: string;
  description: string;
};

const ERROR_MESSAGES: Record<string, AuthError> = {
  provider_email_needs_verification: {
    title: "이메일 인증이 필요합니다",
    description:
      "선택한 소셜 계정의 이메일이 아직 인증되지 않았습니다. 해당 서비스에서 이메일 인증을 완료한 뒤 다시 시도해주세요.",
  },
  access_denied: {
    title: "로그인이 취소되었습니다",
    description: "동의 화면에서 취소를 누르셨거나 권한이 거부되었습니다.",
  },
  server_error: {
    title: "서버 오류",
    description: "잠시 후 다시 시도해주세요.",
  },
};

function parseHash(hash: string): URLSearchParams | null {
  if (!hash || hash.length < 2) return null;
  return new URLSearchParams(hash.slice(1));
}

export function AuthErrorBanner() {
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const params = parseHash(window.location.hash);
    if (!params) return;

    const errorCode = params.get("error_code") ?? params.get("error");
    const description = params.get("error_description");
    if (!errorCode && !description) return;

    const mapped =
      (errorCode && ERROR_MESSAGES[errorCode]) ||
      (description
        ? {
            title: "로그인에 실패했습니다",
            description: description.replace(/\+/g, " "),
          }
        : null);

    if (mapped) setError(mapped);

    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  }, []);

  if (!error) return null;

  return (
    <div
      role="alert"
      className="mb-6 flex items-start justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
    >
      <div className="flex flex-col gap-0.5">
        <p className="font-medium">{error.title}</p>
        <p className="text-xs leading-relaxed text-red-700/90 dark:text-red-300/90">
          {error.description}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setError(null)}
        aria-label="닫기"
        className="-mr-1 -mt-1 rounded p-1 text-red-700 transition hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900/40"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M6.225 4.811a1 1 0 0 0-1.414 1.414L8.586 10l-3.775 3.775a1 1 0 1 0 1.414 1.414L10 11.414l3.775 3.775a1 1 0 0 0 1.414-1.414L11.414 10l3.775-3.775a1 1 0 0 0-1.414-1.414L10 8.586 6.225 4.811Z" />
        </svg>
      </button>
    </div>
  );
}
