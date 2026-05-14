import { logout } from "@/app/auth/actions";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types/post";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles (
        nickname
      )
    `,
    )
    .order("created_at", { ascending: false });

  const typedPosts = posts as unknown as Post[] | null;

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
                Don't Worry Board
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
              typedPosts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`}>
                  <PostCard post={post} />
                </Link>
              ))
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
