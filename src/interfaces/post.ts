export type Category =
  | "frontend"
  | "book"
  | "product"
  | "retrospect"
  | "data"
  | "marketing"
  | "planning"
  | "movie";

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
  draft?: boolean;
  // Optional during transition; recommend making required once all posts updated
  category?: Category;
};
