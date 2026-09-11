"use client";

import { FcGoogle } from "react-icons/fc";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSession } from "@/app/_components/comments/use-session";
import { AuthErrorBanner } from "./auth-error-banner";

function getDisplayName(email: string | undefined, meta: Record<string, unknown>) {
  return (
    (meta.full_name as string | undefined) ??
    (meta.name as string | undefined) ??
    email ??
    "사용자"
  );
}

export function AdminPanel() {
  const { user, isOwner, loading } = useSession();

  const handleSignIn = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        세션 확인 중...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AuthErrorBanner />

      {user ? (
        <div className="flex flex-col gap-4 rounded-md border border-neutral-200 p-4 text-sm dark:border-neutral-800">
          <div>
            <p className="font-medium text-neutral-900 dark:text-neutral-100">
              {getDisplayName(user.email, user.user_metadata ?? {})}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {user.email}
            </p>
          </div>
          <p
            className={
              isOwner
                ? "text-blue-600 dark:text-blue-400"
                : "text-red-600 dark:text-red-400"
            }
          >
            {isOwner
              ? "작성자 권한이 있습니다. 댓글에 (작성자) 배지가 붙습니다."
              : "이 계정에는 작성자 권한이 없습니다."}
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="self-start rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-800 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSignIn}
          className="inline-flex items-center gap-2 self-start rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          <FcGoogle className="h-[18px] w-[18px]" />
          Google로 로그인
        </button>
      )}
    </div>
  );
}
