export type Category =
  | "guide"
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
  // 초안 작성에 생성형 AI를 활용한 글. 목록과 본문에 표식과 고지를 함께 노출한다.
  aiAssisted?: boolean;
  // Optional during transition; recommend making required once all posts updated
  category?: Category;
};
