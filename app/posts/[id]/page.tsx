import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Post } from "@/types/post";
import { CommentList } from "@/components/comment-list";
import { CommentForm } from "@/components/comment-form";
import { Comment } from "@/types/comment";
import { PostOwnerEditor } from "@/components/post-owner-editor";
import { PostImageGallery } from "@/components/post-image-gallery";

export default async function PostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ cpage?: string }>;
}) {
  const { id } = await params;
  const { cpage } = await searchParams;
  const supabase = await createClient();

  const currentCommentPage = Math.max(1, parseInt(cpage || "1", 10) || 1);
  const pageSize = 6;
  const from = (currentCommentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  // Parallel data fetching for post, comments, and user
  const [postResponse, commentsResponse, userResponse] = await Promise.all([
    supabase
      .from("posts")
      .select(`
        *,
        profiles (
          nickname
        )
      `)
      .eq("id", id)
      .single(),
    supabase
      .from("comments")
      .select(`
        *,
        profiles (
          nickname
        )
      `, { count: "exact" })
      .eq("post_id", id)
      .order("created_at", { ascending: true })
      .range(from, to),
    supabase.auth.getUser()
  ]);

  const { data: post, error } = postResponse;
  const { data: commentsData, count: commentsCount } = commentsResponse;
  const { data: { user } } = userResponse;

  if (error || !post) {
    console.error("Error fetching post:", error);
    notFound();
  }

  const comments = (commentsData || []) as unknown as Comment[];
  const totalCommentsCount = commentsCount || 0;
  const totalCommentPages = Math.ceil(totalCommentsCount / pageSize);

  const typedPost = post as unknown as Post;
  const isPostOwner = user?.id === typedPost.author_id;      
  const authorNickname = typedPost.profiles?.nickname || "Anonymous";

  // Debugging log for deployment
  if (isPostOwner) {
    console.log("DEBUG: User is the owner of this post", user?.id);
  } else {
    console.log("DEBUG: User is NOT the owner", { userId: user?.id, authorId: typedPost.author_id });
  }

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
          {isPostOwner ? (
            <PostOwnerEditor
              postId={typedPost.id}
              initialTitle={typedPost.title}
              initialContent={typedPost.content}
              authorNickname={authorNickname}
              createdAt={typedPost.created_at}
              imageUrls={typedPost.image_urls || []}
            />
          ) : (
            <>
              <header className="mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-8">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">
                  {typedPost.title}
                </h1>
                <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {authorNickname}
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

              <div className="prose prose-zinc dark:prose-invert max-w-none mb-8">
                <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg">
                  {typedPost.content}
                </p>
              </div>

              {typedPost.image_urls && typedPost.image_urls.length > 0 && (
                <PostImageGallery 
                  images={typedPost.image_urls} 
                  alt={typedPost.title} 
                />
              )}
            </>
          )}
        </article>

        <section className="space-y-8">
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
              조언 {totalCommentsCount}
            </h2>

            <div className="mb-12">
              {user ? (
                <CommentForm postId={id} />
              ) : (
                <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 text-center border border-dashed border-zinc-300 dark:border-zinc-700">
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    로그인하면 조언을 남길 수 있습니다.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/login">로그인하기</Link> 
                  </Button>
                </div>
              )}
            </div>

            <CommentList comments={comments} currentUserId={user?.id} />

            {/* Comment Pagination Controls */}
            {totalCommentPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  disabled={currentCommentPage <= 1}
                  className={currentCommentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                >
                  <Link href={`/posts/${id}?cpage=${currentCommentPage - 1}`}>
                    <ChevronLeft className="h-4 w-4" />      
                  </Link>
                </Button>

                {(() => {
                  const startPage = Math.floor((currentCommentPage - 1) / 5) * 5 + 1;
                  const endPage = Math.min(startPage + 4, totalCommentPages);
                  const pages = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }
                  return pages.map((p) => (
                    <Button
                      key={p}
                      variant={p === currentCommentPage ? "default" : "outline"}
                      size="icon"
                      asChild
                      className="w-9 h-9"
                    >
                      <Link href={`/posts/${id}?cpage=${p}`}>{p}</Link>
                    </Button>
                  ));
                })()}

                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  disabled={currentCommentPage >= totalCommentPages}
                  className={currentCommentPage >= totalCommentPages ? "pointer-events-none opacity-50" : ""}
                >
                  <Link href={`/posts/${id}?cpage=${currentCommentPage + 1}`}>
                    <ChevronRight className="h-4 w-4" />     
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
