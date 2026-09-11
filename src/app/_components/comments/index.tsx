"use client";

import { useState } from "react";
import { useSession } from "./use-session";
import { useComments } from "./use-comments";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { AuthPanel } from "./auth-panel";

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
        {!user && (
          <div className="mb-4">
            {authOpen ? (
              <AuthPanel onClose={() => setAuthOpen(false)} />
            ) : (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                로그인 없이 바로 댓글을 남길 수 있습니다.{" "}
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="font-medium text-neutral-800 underline underline-offset-2 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white"
                >
                  로그인
                </button>
                하면 닉네임이 자동으로 붙고 내 댓글을 삭제할 수 있습니다.
              </p>
            )}
          </div>
        )}
        <CommentForm user={user} onSubmit={addComment} />
      </div>
    </section>
  );
}
