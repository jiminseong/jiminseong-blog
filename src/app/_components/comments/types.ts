export type AddCommentInput =
  | {
      kind: "anonymous";
      authorName: string;
      body: string;
      honeypot: string;
      parentId?: string;
    }
  | {
      kind: "authenticated";
      userId: string;
      body: string;
      honeypot: string;
      parentId?: string;
    };
