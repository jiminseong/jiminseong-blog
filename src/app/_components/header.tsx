import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

const Header = () => {
  return (
    <div className="mt-8 mb-12">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight flex items-center">
        <Link href="/" className="hover:underline">
          Jiminseong Blog.
        </Link>
      </h2>
      <nav className="mt-4 flex flex-wrap gap-3 text-sm">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="px-3 py-1 rounded-full border border-slate-300/40 hover:border-slate-500/70 hover:bg-slate-200/30 dark:hover:bg-slate-800/40"
          >
            {c.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Header;
