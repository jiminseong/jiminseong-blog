"use client";

import { useEffect, useState } from "react";
import { useSession } from "./use-session";
import { useComments } from "./use-comments";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { AuthModal } from "./auth-modal";
import { publishCommentCount } from "../reading-dock";

type Props = {
  slug: string;
};

export default function Comments({ slug }: Props) {
  const { user, isOwner } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const {
    topLevel,
    repliesByParent,
    topLevelCount,
    hasMore,
    loading,
    loadingMore,
    error,
    loadMore,
    addComment,
    deleteComment,
  } = useComments(slug);

  const replyCount = Object.values(repliesByParent).reduce(
    (sum, list) => sum + list.length,
    0,
  );
  const totalCount = topLevelCount + replyCount;

  // 하단 읽기 도크가 같은 쿼리를 다시 날리지 않도록 개수만 넘겨준다.
  useEffect(() => {
    publishCommentCount(totalCount);
  }, [totalCount]);

  const handleDelete = async (id: string, parentId?: string | null) => {
    try {
      await deleteComment(id, parentId);
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "댓글 삭제에 실패했습니다.",
      );
    }
  };

  return (
    <section id="comments" aria-label="댓글" className="mx-auto mt-16 max-w-2xl scroll-mt-8">
      <h2 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        댓글{" "}
        {totalCount > 0 && (
          <span className="text-neutral-500 dark:text-neutral-400">
            {totalCount}
          </span>
        )}
      </h2>

      <CommentList
        topLevel={topLevel}
        repliesByParent={repliesByParent}
        topLevelCount={topLevelCount}
        hasMore={hasMore}
        loading={loading}
        loadingMore={loadingMore}
        user={user}
        isOwner={isOwner}
        onDelete={handleDelete}
        onLoadMore={loadMore}
        onReplySubmit={addComment}
      />

      {error && (
        <p className="mt-4 text-xs text-red-600 dark:text-red-400">
          댓글을 불러오지 못했습니다: {error}
        </p>
      )}

      <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <CommentForm
          user={user}
          onSubmit={addComment}
          onRequestAuth={() => setAuthOpen(true)}
        />
      </div>

      <AuthModal open={!user && authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
}
