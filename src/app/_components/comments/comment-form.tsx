"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthButtons } from "./auth-buttons";
import type { AddCommentInput } from "./types";

const RATE_LIMIT_KEY = "comment-last-submitted-at";
const RATE_LIMIT_MS = 30_000;
const MAX_NAME = 40;
const MAX_BODY = 2000;

type Props = {
  user: User | null;
  onSubmit: (payload: AddCommentInput) => Promise<void>;
  parentId?: string;
  onCancel?: () => void;
};

function getDisplayName(user: User): string {
  const meta = user.user_metadata ?? {};
  return (
    (meta.full_name as string | undefined) ??
    (meta.name as string | undefined) ??
    (meta.user_name as string | undefined) ??
    (meta.preferred_username as string | undefined) ??
    user.email ??
    "사용자"
  );
}

export function CommentForm({ user, onSubmit, parentId, onCancel }: Props) {
  const isReply = !!parentId;
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    await getSupabaseBrowserClient().auth.signOut();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (honeypot) return;

    const last = Number(localStorage.getItem(RATE_LIMIT_KEY) ?? 0);
    if (last && Date.now() - last < RATE_LIMIT_MS) {
      setError("잠시 후 다시 시도해주세요.");
      return;
    }

    const trimmedBody = body.trim();
    if (!trimmedBody) {
      setError("내용을 입력해주세요.");
      return;
    }
    if (trimmedBody.length > MAX_BODY) {
      setError(isReply ? "답글이 너무 깁니다." : "댓글이 너무 깁니다.");
      return;
    }

    if (!user) {
      const trimmedName = name.trim();
      if (trimmedName.length > MAX_NAME) {
        setError("이름은 40자 이내로 입력해주세요.");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (user) {
        await onSubmit({
          kind: "authenticated",
          userId: user.id,
          body: trimmedBody,
          honeypot,
          parentId,
        });
      } else {
        await onSubmit({
          kind: "anonymous",
          authorName: name.trim() || "익명",
          body: trimmedBody,
          honeypot,
          parentId,
        });
      }
      localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
      setBody("");
      if (!user) setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "댓글 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {user ? (
        !isReply && (
          <div className="flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-300">
            <span>
              <span className="font-medium">{getDisplayName(user)}</span> 으로 작성 중
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-neutral-500 underline-offset-2 hover:underline dark:text-neutral-400"
            >
              로그아웃
            </button>
          </div>
        )
      ) : (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={MAX_NAME}
          placeholder={isReply ? "이름 (선택)" : "이름 (비워두면 '익명'으로 등록)"}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />
      )}

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={MAX_BODY}
        rows={isReply ? 3 : 4}
        placeholder={isReply ? "답글을 남겨주세요" : "댓글을 남겨주세요"}
        className="w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
      />

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
      />

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {!user && !isReply ? <AuthButtons /> : <span aria-hidden />}
        <div className="ml-auto flex items-center gap-2">
          {isReply && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-3 py-1.5 text-sm text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {submitting
              ? "등록 중..."
              : isReply
                ? "답글 등록"
                : "댓글 등록"}
          </button>
        </div>
      </div>

      {!user && !isReply && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          이름을 비우면 <span className="font-medium">익명</span>으로 등록됩니다. 소셜 로그인 시 닉네임·프로필 사진이 자동 적용됩니다.
        </p>
      )}
    </form>
  );
}
