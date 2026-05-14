import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Post } from "@/types/post";
import { CommentList } from "@/components/comment-list";
import { CommentForm } from "@/components/comment-form";
import { Comment } from "@/types/comment";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch a single post by ID including nickname from profiles
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (
        nickname
      )
    `)
    .eq("id", id)
    .single();

  if (error || !post) {
    console.error("Error fetching post:", error);
    notFound();
  }

  // Fetch comments for this post
  const { data: commentsData } = await supabase
    .from("comments")
    .select(`
      *,
      profiles (
        nickname
      )
    `)
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  const comments = (commentsData || []) as unknown as Comment[];

  // Check authentication status
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const typedPost = post as unknown as Post;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-8 -ml-4 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to List
          </Link>
        </Button>

        <article className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm mb-8">
          <header className="mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-8">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">
              {typedPost.title}
            </h1>
            <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm">
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {typedPost.profiles?.nickname || "Anonymous"}
              </span>
              <span className="mx-2 text-zinc-300 dark:text-zinc-700">•</span>
              <time dateTime={typedPost.created_at}>
                {new Date(typedPost.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </header>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg">
              {typedPost.content}
            </p>
          </div>
        </article>

        <section className="space-y-8">
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
              댓글 {comments.length}
            </h2>

            <div className="mb-12">
              {user ? (
                <CommentForm postId={id} />
              ) : (
                <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 text-center border border-dashed border-zinc-300 dark:border-zinc-700">
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    댓글을 남기려면 로그인이 필요합니다.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/login">로그인하기</Link>
                  </Button>
                </div>
              )}
            </div>

            <CommentList comments={comments} />
          </div>
        </section>
      </div>
    </div>
  );
}
