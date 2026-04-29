"use client";

import { useState } from "react";
import type { Provider } from "@supabase/supabase-js";
import type { IconType } from "react-icons";
import { FcGoogle } from "react-icons/fc";
import { SiGithub, SiDiscord, SiNotion } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type ProviderConfig = {
  id: Provider;
  label: string;
  bg: string;
  fg: string;
  Icon: IconType;
  ringClass?: string;
};

const PROVIDERS: ProviderConfig[] = [
  {
    id: "google",
    label: "Google",
    bg: "#ffffff",
    fg: "#000000",
    Icon: FcGoogle,
    ringClass: "ring-neutral-200 dark:ring-neutral-700",
  },
  {
    id: "github",
    label: "GitHub",
    bg: "#181717",
    fg: "#ffffff",
    Icon: SiGithub,
  },
  {
    id: "kakao",
    label: "카카오",
    bg: "#FEE500",
    fg: "#000000",
    Icon: RiKakaoTalkFill,
  },
  {
    id: "discord",
    label: "Discord",
    bg: "#5865F2",
    fg: "#ffffff",
    Icon: SiDiscord,
  },
  {
    id: "notion",
    label: "Notion",
    bg: "#000000",
    fg: "#ffffff",
    Icon: SiNotion,
  },
];

export function AuthButtons() {
  const [expanded, setExpanded] = useState(false);

  const handleClick = async (provider: Provider) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const next = encodeURIComponent(window.location.pathname);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="auth-providers-list"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        <span>로그인</span>
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-90" : ""}`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M7.05 4.05a1 1 0 0 1 1.414 0l5.243 5.243a1 1 0 0 1 0 1.414l-5.243 5.243a1 1 0 1 1-1.414-1.414L11.586 10 7.05 5.464a1 1 0 0 1 0-1.414Z" />
        </svg>
      </button>

      <div
        id="auth-providers-list"
        role="group"
        aria-label="소셜 로그인 제공자"
        aria-hidden={!expanded}
        className="-my-1 flex items-center gap-2 overflow-x-clip py-1 transition-[max-width] duration-500 ease-out"
        style={{ maxWidth: expanded ? `${PROVIDERS.length * 44 + 8}px` : "0px" }}
      >
        {PROVIDERS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleClick(p.id)}
            aria-label={`${p.label}로 로그인`}
            title={p.label}
            tabIndex={expanded ? 0 : -1}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full shadow-sm ring-1 transition duration-300 ease-out hover:scale-110 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${p.ringClass ?? "ring-black/10"}`}
            style={{
              backgroundColor: p.bg,
              color: p.fg,
              opacity: expanded ? 1 : 0,
              transform: expanded ? "translateX(0) scale(1)" : "translateX(-12px) scale(0.85)",
              transitionDelay: expanded ? `${i * 50}ms` : "0ms",
            }}
          >
            <p.Icon className="h-[18px] w-[18px]" />
          </button>
        ))}
      </div>
    </div>
  );
}
