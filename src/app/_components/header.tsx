"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, SOCIAL_LINKS } from "@/lib/constants";
import { Profile } from "./profile";
import { ThemeSwitcher } from "./theme-switcher";

const PAGES = [
  { href: "/", label: "블로그" },
  { href: "/portfolio", label: "포트폴리오" },
  { href: "/resume", label: "이력서" },
];

const PageNav = ({ pathname }: { pathname: string }) => {
  const isActive = (href: string) =>
    href === "/" ? !PAGES.slice(1).some((p) => pathname.startsWith(p.href)) : pathname.startsWith(href);

  return (
    <nav className="flex items-center rounded-full border border-slate-300/50 dark:border-slate-700/60 p-0.5 text-xs md:text-sm">
      {PAGES.map((page) => (
        <Link
          key={page.href}
          href={page.href}
          className={
            isActive(page.href)
              ? "px-2.5 md:px-3 py-1 rounded-full bg-slate-700 text-slate-50 dark:bg-slate-200 dark:text-slate-900"
              : "px-2.5 md:px-3 py-1 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          }
        >
          {page.label}
        </Link>
      ))}
    </nav>
  );
};

const Header = () => {
  const pathname = usePathname();

  return (
    <div className="mt-8 mb-12">
      <div className="flex items-center justify-between gap-x-4 gap-y-3 flex-wrap">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">
          <Link href="/" className="hover:underline">
            Jiminseong Blog.
          </Link>
        </h2>
        <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-end">
          <Profile
            name="지민성"
            profileImage="/assets/blog/author/profile.png"
            githubUrl={SOCIAL_LINKS.github}
            linkedinUrl={SOCIAL_LINKS.linkedin}
          />
          <PageNav pathname={pathname} />
          <ThemeSwitcher />
        </div>
      </div>
      {!PAGES.slice(1).some((p) => pathname.startsWith(p.href)) && (
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
