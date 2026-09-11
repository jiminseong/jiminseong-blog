"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

const MAX_NAME = 40;
const MIN_PASSWORD = 8;

const ERROR_MESSAGES: Array<[RegExp, string]> = [
  [/invalid login credentials/i, "이메일 또는 비밀번호가 올바르지 않습니다."],
  [/user already registered/i, "이미 가입된 이메일입니다. 로그인해주세요."],
  [/password should be at least/i, "비밀번호가 너무 짧습니다."],
  [/unable to validate email|invalid email/i, "이메일 형식이 올바르지 않습니다."],
  [/email rate limit|rate limit/i, "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."],
  [/email not confirmed/i, "이메일 인증이 완료되지 않았습니다."],
  [/signups not allowed|signup is disabled/i, "현재 회원가입이 비활성화되어 있습니다."],
  [/email logins are disabled|provider is not enabled/i, "이메일 로그인이 비활성화되어 있습니다."],
];

function toKoreanError(message: string): string {
  for (const [pattern, text] of ERROR_MESSAGES) {
    if (pattern.test(message)) return text;
  }
  return message;
}

type Props = {
  onClose: () => void;
};

export function AuthPanel({ onClose }: Props) {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isSignup = mode === "signup";

  const switchMode = (next: Mode) => {
    setMode(next);
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
    if (!trimmedEmail) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(`비밀번호는 ${MIN_PASSWORD}자 이상이어야 합니다.`);
      return;
    }

    const trimmedNickname = nickname.trim();
    if (isSignup) {
      if (!trimmedNickname) {
        setError("닉네임을 입력해주세요.");
        return;
      }
      if (trimmedNickname.length > MAX_NAME) {
        setError("닉네임은 40자 이내로 입력해주세요.");
        return;
      }
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
            "가입 확인 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인해주세요.",
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
    "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/40"
    >
      <div className="flex items-center gap-4 text-sm">
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={
            isSignup
              ? "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              : "font-medium text-neutral-900 underline underline-offset-4 dark:text-neutral-100"
          }
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={
            isSignup
              ? "font-medium text-neutral-900 underline underline-offset-4 dark:text-neutral-100"
              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          }
        >
          회원가입
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="ml-auto text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          닫기
        </button>
      </div>

      {isSignup && (
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={MAX_NAME}
          placeholder="닉네임 (댓글에 표시됩니다)"
          autoComplete="nickname"
          className={inputClass}
        />
      )}
      <input
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

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      {notice && (
        <p className="text-xs text-neutral-600 dark:text-neutral-300">{notice}</p>
      )}

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {submitting ? "처리 중..." : isSignup ? "가입하기" : "로그인"}
        </button>
      </div>
    </form>
  );
}
