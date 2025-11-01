export type Category =
  | "frontend"
  | "book"
  | "product"
  | "retrospect"
  | "computer-science";

export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  preview?: boolean;
  // Optional during transition; recommend making required once all posts updated
  category?: Category;
};
