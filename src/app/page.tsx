import Link from "next/link";
import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import Header from "@/app/_components/header";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "@/lib/api";

export default function Index() {
  const allPosts = getAllPosts();

  const heroPost = allPosts[0];

  const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Header />

        {/* 글 목록만 보고 나가는 사람이 많아서, 나를 보러 온 사람이 갈 곳을 홈에 한 줄 둔다. */}
        <div className="-mt-6 mb-12 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          <span>지민성이 만든 것들 →</span>
          <Link
            href="/portfolio"
            className="underline underline-offset-4 decoration-slate-300 hover:text-slate-900 hover:decoration-slate-500 dark:decoration-slate-600 dark:hover:text-slate-100 dark:hover:decoration-slate-400 transition-colors"
          >
            포트폴리오
          </Link>
          <span aria-hidden>·</span>
          <Link
            href="/resume"
            className="underline underline-offset-4 decoration-slate-300 hover:text-slate-900 hover:decoration-slate-500 dark:decoration-slate-600 dark:hover:text-slate-100 dark:hover:decoration-slate-400 transition-colors"
          >
            이력서
          </Link>
        </div>

        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
          aiAssisted={heroPost.aiAssisted}
        />

        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </main>
  );
}
