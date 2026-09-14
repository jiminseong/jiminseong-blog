import Link from "next/link";
import Container from "./container";
import pkg from "../../../package.json";

const links = [
  { href: "/portfolio", label: "포트폴리오" },
  { href: "/resume", label: "이력서" },
  { href: "/feed.xml", label: "RSS" },
];

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-300/50 dark:border-slate-700/60">
      <Container>
        {/* 아래 여백은 글 페이지의 플로팅 도크가 링크를 가리지 않게 하려고 넉넉히 둔다. */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-8 pb-28 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>© {new Date().getFullYear()} 지민성</span>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/changelog"
            title="버전 기록"
            className="font-mono text-xs text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-200 transition-colors"
          >
            v{pkg.version}
          </Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
