import type { Category } from "@/interfaces/post";

export const EXAMPLE_PATH = "blog-starter";
export const NAME = "지민성";
export const HOME_OG_IMAGE_URL =
  "https://og-image.vercel.app/Next.js%20Blog%20Starter%20Example.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg";

export const CATEGORIES = [
  { slug: "frontend", label: "Frontend" },
  { slug: "book", label: "Book" },
  { slug: "product", label: "Product" },
  { slug: "retrospect", label: "Retrospect" },
  { slug: "computer-science", label: "Computer Science" },
] as const;

export const CATEGORY_SLUGS: Category[] = CATEGORIES.map((c) => c.slug) as Category[];

export const CATEGORY_LABEL: Record<Category, string> = {
  frontend: "Frontend",
  book: "Book",
  product: "Product",
  retrospect: "Retrospect",
  "computer-science": "Computer Science",
};
