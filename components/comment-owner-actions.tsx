"use client";

import { deleteComment, updateComment } from "@/app/posts/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";

interface CommentOwnerActionsProps {
  commentId: string;
  initialContent: string;
}

export function CommentOwnerActions({
  commentId,
  initialContent,
}: CommentOwnerActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("commentId", commentId);
        formData.append("content", content);
        await updateComment(formData);
        setIsEditing(false);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          return;
        }

        setError("댓글 수정 중 오류가 발생했습니다.");
      }
    });
  };

  const handleDelete = () => {
    const shouldDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (!shouldDelete) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("commentId", commentId);
        await deleteComment(formData);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          return;
        }

        setError("댓글 삭제 중 오류가 발생했습니다.");
      }
    });
  };

  return (
    <div className="space-y-3">
      {isEditing ? (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          className="min-h-[90px]"
        />
      ) : (
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      )}

      <div className="flex items-center justify-end gap-2">
        {isEditing ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={handleUpdate}
            >
              {isPending ? "수정 중..." : "수정"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => {
                setContent(initialContent);
                setError(null);
                setIsEditing(false);
              }}
            >
              취소
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => setIsEditing(true)}
            >
              수정
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={handleDelete}
            >
              삭제
            </Button>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
