"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { User } from "@supabase/supabase-js";
import type { Comment } from "@/interfaces/comment";
import { CommentForm } from "./comment-form";
import type { AddCommentInput } from "./types";

type Props = {
  comment: Comment;
  replies?: Comment[];
  user: User | null;
  isOwner: boolean;
  onDelete: (id: string, parentId?: string | null) => void;
  onReplySubmit: (input: AddCommentInput) => Promise<void>;
  isReply?: boolean;
};

export function CommentItem({
  comment,
  replies = [],
  user,
  isOwner,
  onDelete,
  onReplySubmit,
  isReply = false,
}: Props) {
  const [replyOpen, setReplyOpen] = useState(false);

  const name = comment.author_name ?? "삭제된 사용자";
  const avatar = comment.author_avatar_url;
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const canDelete = isOwner || (!!user && comment.user_id === user.id);
  const isAuthor = comment.author_role === "owner";

  const handleDelete = () => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      onDelete(comment.id, comment.parent_id ?? null);
    }
  };

  const handleReplySubmit = async (input: AddCommentInput) => {
    await onReplySubmit({ ...input, parentId: comment.id });
    setReplyOpen(false);
  };

  return (
    <li className={isReply ? "flex gap-3 py-3" : "flex gap-3 py-4"}>
      {avatar ? (
        <Image
          src={avatar}
          alt=""
          width={isReply ? 28 : 36}
          height={isReply ? 28 : 36}
          className={`flex-shrink-0 rounded-full object-cover ${isReply ? "h-7 w-7" : "h-9 w-9"}`}
          unoptimized
        />
      ) : (
        <div
          className={`flex flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 ${
            isReply ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"
          }`}
        >
          {initial}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span
            className={`text-sm font-medium ${
              isAuthor
                ? "text-blue-600 dark:text-blue-400"
                : "text-neutral-900 dark:text-neutral-100"
            }`}
          >
            {name}
          </span>
          {isAuthor && (
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              (작성자)
            </span>
          )}
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {formatDistanceToNow(new Date(comment.created_at), {
              locale: ko,
              addSuffix: true,
            })}
          </span>
          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="ml-auto text-xs text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
            >
              삭제
            </button>
          )}
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-neutral-800 dark:text-neutral-200">
          {comment.body}
        </p>

        {!isReply && (
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setReplyOpen((v) => !v)}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              {replyOpen ? "답글 닫기" : "답글"}
            </button>
            {replies.length > 0 && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                답글 {replies.length}
              </span>
            )}
          </div>
        )}

        {!isReply && replyOpen && (
          <div className="mt-3">
            <CommentForm
              user={user}
              onSubmit={handleReplySubmit}
              parentId={comment.id}
              onCancel={() => setReplyOpen(false)}
            />
          </div>
        )}

        {!isReply && replies.length > 0 && (
          <ul className="mt-3 ml-2 border-l border-neutral-200 pl-4 dark:border-neutral-800">
            {replies.map((r) => (
              <CommentItem
                key={r.id}
                comment={r}
                user={user}
                isOwner={isOwner}
                onDelete={onDelete}
                onReplySubmit={onReplySubmit}
                isReply
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
