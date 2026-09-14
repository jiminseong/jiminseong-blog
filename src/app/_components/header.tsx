"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, SOCIAL_LINKS } from "@/lib/constants";
import { Profile } from "./profile";
import { ThemeSwitcher } from "./theme-switcher";
import { ReadingDock } from "./reading-dock";
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

// 블로그(홈·글·카테고리)가 아닌 경로. 카테고리 줄을 숨긴다.
const NON_BLOG_PATHS = ["/portfolio", "/resume", "/changelog"];
const isNonBlogPath = (pathname: string) =>
  NON_BLOG_PATHS.some((p) => pathname.startsWith(p));

const Header = () => {
  const pathname = usePathname();
  // 읽기 도크는 글을 읽는 동안에만 쓸모가 있어서 글 페이지에만 띄운다.
  const isPost = pathname.startsWith("/posts/");

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
      {isPost && <ReadingDock key={pathname} />}
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
