import type { NextConfig } from "next";

// 예전 단일 슬러그 주소를 폴더 구조로 옮기면서 남긴 흔적.
const legacyRedirects = [
  ["/posts/chrome-extension-1", "/posts/chrome-extension/basics"],
  ["/posts/chrome-extension-2", "/posts/chrome-extension/safe-comment"],
  ["/posts/daangn-1", "/posts/daangn/builders-camp"],
  ["/posts/firstmonth", "/posts/ict-internship/first-month"],
  ["/posts/gyeongidojisasang", "/posts/wooimi/gyeonggi-governor-award"],
  ["/posts/mandal-art-2025", "/posts/mandal-art/2025"],
  ["/posts/therightit", "/posts/the-right-it/ideas-review"],
  ["/posts/wooimi-1", "/posts/wooimi/tech-stack"],
  // 가이드 슬러그에서 연도 제거 (2026-09-13). 공개 후 바꾼 거라 옛 주소를 살려 둔다.
  ["/posts/guide/vercel-domain-setup-2026", "/posts/guide/vercel-domain-setup/1"],
  ["/guide/vercel-domain-setup-2026", "/posts/guide/vercel-domain-setup/1"],
  // 2026-09-13 두 편으로 나누며 폴더 구조(/1, /2)로 이동. 그날 공개됐던 주소들을 살려 둔다.
  ["/posts/guide/vercel-domain-setup", "/posts/guide/vercel-domain-setup/1"],
  ["/guide/vercel-domain-setup", "/posts/guide/vercel-domain-setup/1"],
  ["/posts/guide/vercel-domain-setup-2", "/posts/guide/vercel-domain-setup/2"],
  ["/guide/vercel-domain-setup-2", "/posts/guide/vercel-domain-setup/2"],
] as const;

// 가이드 글은 공유하기 쉬운 짧은 주소를 하나 더 둔다.
// jiminseong.com/guide/<슬러그> 로 들어오면 실제 글로 보낸다.
// :path* 라 /guide/시리즈/1 처럼 폴더 안의 글도 받는다.
const vanityRedirects = [["/guide/:path*", "/posts/guide/:path*"]] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [...legacyRedirects, ...vanityRedirects].map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
