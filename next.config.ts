import type { NextConfig } from "next";

const redirects = [
  ["/posts/chrome-extension-1", "/posts/chrome-extension/basics"],
  ["/posts/chrome-extension-2", "/posts/chrome-extension/safe-comment"],
  ["/posts/daangn-1", "/posts/daangn/builders-camp"],
  ["/posts/firstmonth", "/posts/ict-internship/first-month"],
  ["/posts/gyeongidojisasang", "/posts/wooimi/gyeonggi-governor-award"],
  ["/posts/mandal-art-2025", "/posts/mandal-art/2025"],
  ["/posts/therightit", "/posts/the-right-it/ideas-review"],
  ["/posts/wooimi-1", "/posts/wooimi/tech-stack"],
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return redirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
