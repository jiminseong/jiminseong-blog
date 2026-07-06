"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, SOCIAL_LINKS } from "@/lib/constants";
import { Profile } from "./profile";
import { ThemeSwitcher } from "./theme-switcher";

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
        </div>
      </div>
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
        <Link
          href="/portfolio"
          className={
            pathname === "/portfolio"
              ? "px-3 py-1 rounded-full border border-violet-600/80 bg-violet-600 text-white dark:border-violet-400/60 dark:bg-violet-300 dark:text-slate-900"
              : "px-3 py-1 rounded-full border border-violet-500/40 text-violet-700 hover:bg-violet-500/10 dark:border-violet-400/40 dark:text-violet-300 dark:hover:bg-violet-400/10"
          }
        >
          포트폴리오
        </Link>
      </nav>
    </div>
  );
};

export default Header;
