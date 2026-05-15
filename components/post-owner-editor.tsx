"use client";

import { deletePost, updatePost } from "@/app/posts/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";

interface PostOwnerEditorProps {
  postId: string;
  initialTitle: string;
  initialContent: string;
  authorNickname: string;
  createdAt: string;
}

export function PostOwnerEditor({
  postId,
  initialTitle,
  initialContent,
  authorNickname,
  createdAt,
}: PostOwnerEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("postId", postId);
        formData.append("title", title);
        formData.append("content", content);
        await updatePost(formData);
        setIsEditing(false);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          return;
        }

        setError("게시글 수정 중 오류가 발생했습니다.");
      }
    });
  };

  const handleDelete = () => {
    const shouldDelete = window.confirm("게시글을 삭제하시겠습니까?");
    if (!shouldDelete) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("postId", postId);
        await deletePost(formData);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          return;
        }

        setError("게시글 삭제 중 오류가 발생했습니다.");
      }
    });
  };

  return (
    <>
      <header className="mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-8">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              className="text-lg"
              placeholder="제목을 입력하세요"
            />
          </div>
        ) : (
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">
            {title}
          </h1>
        )}

        <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm mt-4">
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {authorNickname}
          </span>
          <span className="mx-2 text-zinc-300 dark:text-zinc-700">•</span>
          <time dateTime={createdAt}>
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending}
            className="min-h-[220px] whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg"
          />
        ) : (
          <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg">
            {content}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
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
                setTitle(initialTitle);
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

      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
      )}
    </>
  );
}
