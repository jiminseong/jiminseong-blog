import { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { getAllPosts } from "@/lib/api";
import { CATEGORY_LABEL, CATEGORY_SLUGS, NAME } from "@/lib/constants";

type Params = {
  params: Promise<{
    category: (typeof CATEGORY_SLUGS)[number];
  }>;
};

export default async function CategoryPage(props: Params) {
  const params = await props.params;
  const category = params.category;

  const posts = getAllPosts().filter((p) => p.category === category);

  return (
    <main>
      <Container>
        <Header />
        <section>
          <h1 className="text-xl md:text-2xl font-semibold mb-6">
            {CATEGORY_LABEL[category]} 글
          </h1>
          {posts.length === 0 ? (
            <p className="text-sm text-slate-500">이 카테고리의 글이 아직 없습니다.</p>
          ) : (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post.slug} className="border-b border-slate-200/30 pb-4">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-base md:text-lg font-medium hover:underline"
                  >
                    {post.title}
                  </Link>
                  <div className="text-xs text-slate-500 mt-1">{post.date}</div>
                  {post.excerpt && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      {post.excerpt}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </Container>
    </main>
  );
}

export async function generateStaticParams() {
  // Pre-render all categories; pages may be empty until posts are categorized
  return CATEGORY_SLUGS.map((c) => ({ category: c }));
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const category = params.category;
  const label = CATEGORY_LABEL[category];
  const title = `${label} | ${NAME} blog`;
  return {
    title,
    description: `${label} category posts on ${NAME} blog`,
    openGraph: {
      title,
      description: `${label} category posts`,
      type: "website",
    },
  };
}
