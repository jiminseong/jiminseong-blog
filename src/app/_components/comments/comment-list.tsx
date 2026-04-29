"use client";

import type { User } from "@supabase/supabase-js";
import type { Comment } from "@/interfaces/comment";
import { CommentItem } from "./comment-item";
import { PAGE_SIZE } from "./use-comments";
import type { AddCommentInput } from "./types";

type Props = {
  topLevel: Comment[];
  repliesByParent: Record<string, Comment[]>;
  topLevelCount: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  user: User | null;
  isOwner: boolean;
  onDelete: (id: string, parentId?: string | null) => void;
  onLoadMore: () => void;
  onReplySubmit: (input: AddCommentInput) => Promise<void>;
};

export function CommentList({
  topLevel,
  repliesByParent,
  topLevelCount,
  hasMore,
  loading,
  loadingMore,
  user,
  isOwner,
  onDelete,
  onLoadMore,
  onReplySubmit,
}: Props) {
  if (loading) {
    return (
      <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        댓글을 불러오는 중...
      </p>
    );
  }

  if (topLevel.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        첫 댓글을 남겨주세요.
      </p>
    );
  }

  const showLoadMore = topLevelCount > PAGE_SIZE && hasMore;

  return (
    <div>
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {topLevel.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            replies={repliesByParent[c.id] ?? []}
            user={user}
            isOwner={isOwner}
            onDelete={onDelete}
            onReplySubmit={onReplySubmit}
          />
        ))}
      </ul>

      {showLoadMore && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {loadingMore
              ? "불러오는 중..."
              : `더 보기 (${topLevel.length}/${topLevelCount})`}
          </button>
        </div>
      )}
    </div>
  );
}
