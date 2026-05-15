"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("인증이 필요합니다.");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content || title.trim() === "" || content.trim() === "") {
    throw new Error("제목과 내용을 입력해주세요.");
  }

  const { error } = await supabase.from("posts").insert({
    title,
    content,
    author_id: user.id,
  });

  if (error) {
    console.error("Error creating post:", error);
    throw new Error("게시글 작성 중 오류가 발생했습니다.");
  }

  revalidatePath("/");
  redirect("/");
}

export async function createComment(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("인증이 필요합니다.");
  }

  const postId = formData.get("postId") as string;
  const content = formData.get("content") as string;

  if (!postId || !content || content.trim() === "") {
    throw new Error("내용을 입력해주세요.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content,
    author_id: user.id,
  });

  if (error) {
    console.error("Error creating comment:", error);
    throw new Error("댓글 작성 중 오류가 발생했습니다.");
  }

  revalidatePath(`/posts/${postId}`);
}

export async function updatePost(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("인증이 필요합니다.");
  }

  const postId = formData.get("postId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (
    !postId ||
    !title ||
    !content ||
    title.trim() === "" ||
    content.trim() === ""
  ) {
    throw new Error("제목과 내용을 입력해주세요.");
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (postError || !post) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }

  if (post.author_id !== user.id) {
    throw new Error("본인 글만 수정할 수 있습니다.");
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title: title.trim(),
      content: content.trim(),
    })
    .eq("id", postId);

  if (error) {
    console.error("Error updating post:", error);
    throw new Error("게시글 수정 중 오류가 발생했습니다.");
  }

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
}

export async function deletePost(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("인증이 필요합니다.");
  }

  const postId = formData.get("postId") as string;

  if (!postId) {
    throw new Error("잘못된 요청입니다.");
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (postError || !post) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }

  if (post.author_id !== user.id) {
    throw new Error("본인 글만 삭제할 수 있습니다.");
  }

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    console.error("Error deleting post:", error);
    throw new Error("게시글 삭제 중 오류가 발생했습니다.");
  }

  revalidatePath("/");
  redirect("/");
}

export async function updateComment(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("인증이 필요합니다.");
  }

  const commentId = formData.get("commentId") as string;
  const content = formData.get("content") as string;

  if (!commentId || !content || content.trim() === "") {
    throw new Error("내용을 입력해주세요.");
  }

  const { data: comment, error: commentError } = await supabase
    .from("comments")
    .select("author_id, post_id")
    .eq("id", commentId)
    .single();

  if (commentError || !comment) {
    throw new Error("댓글을 찾을 수 없습니다.");
  }

  if (comment.author_id !== user.id) {
    throw new Error("본인 댓글만 수정할 수 있습니다.");
  }

  const { error } = await supabase
    .from("comments")
    .update({
      content: content.trim(),
    })
    .eq("id", commentId);

  if (error) {
    console.error("Error updating comment:", error);
    throw new Error("댓글 수정 중 오류가 발생했습니다.");
  }

  revalidatePath(`/posts/${comment.post_id}`);
}

export async function deleteComment(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("인증이 필요합니다.");
  }

  const commentId = formData.get("commentId") as string;

  if (!commentId) {
    throw new Error("잘못된 요청입니다.");
  }

  const { data: comment, error: commentError } = await supabase
    .from("comments")
    .select("author_id, post_id")
    .eq("id", commentId)
    .single();

  if (commentError || !comment) {
    throw new Error("댓글을 찾을 수 없습니다.");
  }

  if (comment.author_id !== user.id) {
    throw new Error("본인 댓글만 삭제할 수 있습니다.");
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    console.error("Error deleting comment:", error);
    throw new Error("댓글 삭제 중 오류가 발생했습니다.");
  }

  revalidatePath(`/posts/${comment.post_id}`);
}
