import { Post } from "@/interfaces/post";
import { CATEGORY_SLUGS } from "@/lib/constants";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

function collectSlugs(dir: string, prefix = ""): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return collectSlugs(join(dir, entry.name), `${prefix}${entry.name}/`);
    if (entry.isFile() && entry.name.endsWith(".md"))
      return [`${prefix}${entry.name.replace(/\.md$/, "")}`];
    return [];
  });
}

export function getPostSlugs() {
  return collectSlugs(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Validate category if provided; keep optional to avoid breaking existing posts
  const category = (data as any).category as string | undefined;
  if (category && !CATEGORY_SLUGS.includes(category as any)) {
    // eslint-disable-next-line no-console
    console.warn(
      `Invalid category "${category}" in ${realSlug}.md. Allowed: ${CATEGORY_SLUGS.join(", ")}`
    );
  }

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
