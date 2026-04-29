"use client";

import { useSession } from "./use-session";
import { useComments } from "./use-comments";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { AuthErrorBanner } from "./auth-error-banner";

type Props = {
  slug: string;
};

export default function Comments({ slug }: Props) {
  const { user, isOwner } = useSession();
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
    <section aria-label="댓글" className="mx-auto mt-16 max-w-2xl">
      <h2 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        댓글{" "}
        {totalCount > 0 && (
          <span className="text-neutral-500 dark:text-neutral-400">
            {totalCount}
          </span>
        )}
      </h2>

      <AuthErrorBanner />

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
        <CommentForm user={user} onSubmit={addComment} />
      </div>
    </section>
  );
}
