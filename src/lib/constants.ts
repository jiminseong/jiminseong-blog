import type { Category } from "@/interfaces/post";

export const EXAMPLE_PATH = "blog-starter";
export const NAME = "지민성";
export const HOME_OG_IMAGE_URL =
  "https://og-image.vercel.app/Next.js%20Blog%20Starter%20Example.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg";

// 순서가 헤더 카테고리 칩의 노출 순서다.
export const CATEGORIES = [
  { slug: "guide", label: "가이드" },
  { slug: "frontend", label: "프론트엔드" },
  { slug: "book", label: "독서" },
  { slug: "product", label: "프로덕트" },
  { slug: "retrospect", label: "회고" },
  { slug: "data", label: "데이터" },
  { slug: "marketing", label: "마케팅" },
  { slug: "planning", label: "기획" },
  { slug: "movie", label: "영화" },
] as const;

export const CATEGORY_SLUGS: Category[] = CATEGORIES.map((c) => c.slug) as Category[];

// CATEGORIES에서 파생시켜 두 곳이 어긋나는 일을 막는다.
export const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.label])
) as Record<Category, string>;

export const SOCIAL_LINKS = {
  github: "https://github.com/jiminseong",
  linkedin: "https://www.linkedin.com/in/jiminseong",
};
