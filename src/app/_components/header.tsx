"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, SOCIAL_LINKS } from "@/lib/constants";
import pkg from "../../../package.json";
import { Profile } from "./profile";
import { ThemeSwitcher } from "./theme-switcher";
import { useSession } from "./comments/use-session";

// 로그인한 사람의 아바타. 프로필 아이콘 줄 끝에 붙어 "연결돼 있다"는 느낌을 준다.
const ViewerAvatar = () => {
  const { user } = useSession();
  if (!user) return null;

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const name =
    (meta.full_name as string | undefined) ??
    (meta.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "사용자";
  const avatar = meta.avatar_url as string | undefined;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <>
      <span aria-hidden className="h-5 w-px bg-slate-300/70 dark:bg-slate-700/80" />
      <div
        title={`${name} (로그인됨)`}
        aria-label={`${name} 로그인됨`}
        className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-300/60 dark:ring-slate-700/70"
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {initial}
          </div>
        )}
      </div>
    </>
  );
};

const PAGES = [
  { href: "/", label: "블로그" },
  { href: "/portfolio", label: "포트폴리오" },
  { href: "/resume", label: "이력서" },
];

// 블로그(홈·글·카테고리)가 아닌 경로. 카테고리 줄을 숨기고 도크의 '블로그'를 비활성 처리한다.
const NON_BLOG_PATHS = ["/portfolio", "/resume", "/changelog"];
const isNonBlogPath = (pathname: string) =>
  NON_BLOG_PATHS.some((p) => pathname.startsWith(p));

// 아래로 스크롤하면 숨기고, 위로 올리거나 맨 위 근처면 다시 보여준다.
function useDockVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (y < 80) setVisible(true);
        else if (delta > 6) setVisible(false);
        else if (delta < -6) setVisible(true);
        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}

const PageDock = ({ pathname }: { pathname: string }) => {
  const visible = useDockVisible();
  const isActive = (href: string) =>
    href === "/" ? !isNonBlogPath(pathname) : pathname.startsWith(href);

  return (
    <nav
      aria-hidden={!visible}
      className={`fixed bottom-5 left-1/2 z-50 flex items-center rounded-full border border-slate-300/60 dark:border-slate-700/70 bg-[var(--bg-elev)]/90 backdrop-blur px-1 py-1 text-xs shadow-sm transition-all duration-300 ease-out ${
        visible
          ? "-translate-x-1/2 translate-y-0 opacity-100"
          : "-translate-x-1/2 translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      {PAGES.map((page) => (
        <Link
          key={page.href}
          href={page.href}
          className={
            isActive(page.href)
              ? "px-3 py-1 rounded-full bg-slate-700 text-slate-50 dark:bg-slate-200 dark:text-slate-900"
              : "px-3 py-1 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          }
        >
          {page.label}
        </Link>
      ))}
      <span aria-hidden className="mx-1 h-3 w-px bg-slate-300/70 dark:bg-slate-700/80" />
      <Link
        href="/changelog"
        title="버전 기록"
        className={
          pathname.startsWith("/changelog")
            ? "px-2.5 py-1 rounded-full bg-slate-700 font-mono text-[10px] text-slate-50 dark:bg-slate-200 dark:text-slate-900"
            : "px-2.5 py-1 rounded-full font-mono text-[10px] text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-200 transition-colors"
        }
      >
        v{pkg.version}
      </Link>
    </nav>
  );
};

const Header = () => {
  const pathname = usePathname();

  return (
    <div className="mt-8 mb-12">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">
          <Link href="/" className="hover:underline">
            Jiminseong Blog.
          </Link>
        </h2>
        <div className="flex items-center gap-3 md:gap-4">
          <Profile
            name="지민성"
            profileImage="/assets/blog/author/profile.png"
            githubUrl={SOCIAL_LINKS.github}
            linkedinUrl={SOCIAL_LINKS.linkedin}
          />
          <ThemeSwitcher />
          <ViewerAvatar />
        </div>
      </div>
      <PageDock pathname={pathname} />
      {!isNonBlogPath(pathname) && (
      <nav className="mt-5 flex flex-wrap gap-2 text-sm">
        {CATEGORIES.map((c) => {
          const href = `/categories/${c.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={c.slug}
              href={href}
              className={
                active
                  ? "px-3 py-1 rounded-full border border-slate-700/80 bg-slate-700 text-slate-50 dark:border-slate-300/60 dark:bg-slate-200 dark:text-slate-900"
                  : "px-3 py-1 rounded-full border border-slate-300/50 text-slate-600 hover:border-slate-400/70 hover:bg-slate-200/40 dark:border-slate-700/60 dark:text-slate-400 dark:hover:border-slate-600/60 dark:hover:bg-slate-800/40"
              }
            >
              {c.label}
            </Link>
          );
        })}
      </nav>
      )}
    </div>
  );
};

export default Header;
