"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type AuthMode = "signin" | "signup";

// 문구는 여기서만 고치면 된다.
const COPY = {
  title: "jiminseong.com에서 소통하기",
  signin: {
    description: "로그인하면 닉네임으로 댓글이 남고, 내 댓글을 지울 수 있어요.",
    submit: "로그인",
    switchPrompt: "처음이신가요?",
    switchAction: "닉네임 하나로 시작하기",
  },
  signup: {
    description: "닉네임과 이메일만 저장하고, 댓글 표시와 삭제에만 씁니다.",
    submit: "시작하기",
    switchPrompt: "이미 계정이 있다면",
    switchAction: "로그인",
  },
  footer: "이런 블로그를 직접 만들어보고 싶다면",
  contactEmail: "jiminseong.dev@gmail.com",
  footerSuffix: "으로 문의 주세요.",
} as const;

const MAX_NAME = 40;
const MIN_PASSWORD = 8;

const ERROR_MESSAGES: Array<[RegExp, string]> = [
  [/invalid login credentials/i, "이메일 또는 비밀번호가 올바르지 않습니다."],
  [/user already registered/i, "이미 가입된 이메일입니다. 로그인해주세요."],
  [/password should be at least/i, "비밀번호가 너무 짧습니다."],
  [/unable to validate email|invalid email/i, "이메일 형식이 올바르지 않습니다."],
  [/email rate limit|rate limit/i, "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."],
  [/email not confirmed/i, "이메일 인증이 완료되지 않았습니다."],
  [/signups not allowed|signup is disabled/i, "현재 가입이 비활성화되어 있습니다."],
  [/email logins are disabled|provider is not enabled/i, "이메일 로그인이 비활성화되어 있습니다."],
];

function toKoreanError(message: string): string {
  for (const [pattern, text] of ERROR_MESSAGES) {
    if (pattern.test(message)) return text;
  }
  return message;
}

type Props = {
  open: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
};

export function AuthModal({ open, initialMode = "signin", onClose }: Props) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const isSignup = mode === "signup";
  const copy = isSignup ? COPY.signup : COPY.signin;

  // 열릴 때 상태 초기화 + 첫 입력에 포커스, Escape로 닫기, 배경 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setError(null);
    setNotice(null);
    setSubmitting(false);
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, initialMode, onClose]);

  useEffect(() => {
    if (open) firstFieldRef.current?.focus();
  }, [mode, open]);

  if (!open) return null;

  const switchMode = () => {
    setMode(isSignup ? "signin" : "signup");
    setError(null);
    setNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("로그인 기능을 사용할 수 없습니다.");
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedNickname = nickname.trim();

    if (isSignup && !trimmedNickname) {
      setError("닉네임을 입력해주세요.");
      return;
    }
    if (isSignup && trimmedNickname.length > MAX_NAME) {
      setError("닉네임은 40자 이내로 입력해주세요.");
      return;
    }
    if (!trimmedEmail) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(`비밀번호는 ${MIN_PASSWORD}자 이상이어야 합니다.`);
      return;
    }

    setSubmitting(true);
    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: { data: { full_name: trimmedNickname } },
        });
        if (signUpError) throw signUpError;

        // 이메일 인증이 켜져 있으면 세션 없이 user만 돌아온다.
        if (!data.session) {
          setNotice(
            "확인 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인해주세요.",
          );
          setMode("signin");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (signInError) throw signInError;
      }
      onClose();
    } catch (err) {
      setError(
        toKoreanError(err instanceof Error ? err.message : "요청에 실패했습니다."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition focus:border-neutral-900 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-300 dark:focus:bg-neutral-800";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm dark:bg-black/60"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-3 rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M6.225 4.811a1 1 0 0 0-1.414 1.414L8.586 10l-3.775 3.775a1 1 0 1 0 1.414 1.414L10 11.414l3.775 3.775a1 1 0 0 0 1.414-1.414L11.414 10l3.775-3.775a1 1 0 0 0-1.414-1.414L10 8.586 6.225 4.811Z" />
          </svg>
        </button>

        <h2
          id="auth-modal-title"
          className="pr-8 text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
        >
          {COPY.title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {copy.description}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5">
          {isSignup && (
            <input
              ref={firstFieldRef}
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={MAX_NAME}
              placeholder="닉네임"
              autoComplete="nickname"
              className={inputClass}
            />
          )}
          <input
            ref={isSignup ? undefined : firstFieldRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            autoComplete="email"
            className={inputClass}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignup ? `비밀번호 (${MIN_PASSWORD}자 이상)` : "비밀번호"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            className={inputClass}
          />

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
          {notice && (
            <p className="text-xs text-neutral-600 dark:text-neutral-300">{notice}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 w-full rounded-full bg-neutral-900 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {submitting ? "처리 중..." : copy.submit}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
          {copy.switchPrompt}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-700 dark:text-neutral-100 dark:hover:text-neutral-300"
          >
            {copy.switchAction}
          </button>
        </p>

        <p className="mt-5 border-t border-neutral-100 pt-4 text-center text-[11px] leading-relaxed text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
          {COPY.footer}{" "}
          <a
            href={`mailto:${COPY.contactEmail}`}
            className="underline underline-offset-2 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            {COPY.contactEmail}
          </a>
          {COPY.footerSuffix}
        </p>
      </div>
    </div>
  );
}
