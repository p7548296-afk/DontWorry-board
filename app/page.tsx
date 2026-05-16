import { logout } from "@/app/auth/actions";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types/post";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const pageSize = 10;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const {
    data: posts,
    error,
    count,
  } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles (
        nickname
      )
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  const typedPosts = posts as unknown as Post[] | null;
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Don&apos;t Worry Board
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Share your worries and get advice from others.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <form action={logout}>
                    <Button variant="outline" type="submit">
                      Logout
                    </Button>
                  </form>
                  <Button asChild>
                    <Link href="/posts/new">New Post</Link>
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {typedPosts && typedPosts.length > 0 ? (
              <>
                {typedPosts.map((post) => (
                  <Link key={post.id} href={`/posts/${post.id}`}>
                    <PostCard post={post} />
                  </Link>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      disabled={currentPage <= 1}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    >
                      <Link href={`/?page=${currentPage - 1}`}>
                        <ChevronLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    {(() => {
                      const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
                      const endPage = Math.min(startPage + 4, totalPages);
                      const pages = [];
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(i);
                      }
                      return pages.map((p) => (
                        <Button
                          key={p}
                          variant={p === currentPage ? "default" : "outline"}
                          size="icon"
                          asChild
                          className="w-9 h-9"
                        >
                          <Link href={`/?page=${p}`}>{p}</Link>
                        </Button>
                      ));
                    })()}

                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      disabled={currentPage >= totalPages}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    >
                      <Link href={`/?page=${currentPage + 1}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500 dark:text-zinc-400">
                  No posts yet.
                </p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/posts/new">Be the first to share a worry!</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
