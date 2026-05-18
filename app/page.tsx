import { logout } from "@/app/auth/actions";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types/post";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page, search } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user nickname if logged in
  let userNickname = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", user.id)
      .single();
    userNickname = profile?.nickname;
  }

  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const pageSize = 10;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("posts")
    .select(
      `
      *,
      profiles (
        nickname
      ),
      comments!left (
        id
      )
    `,
      { count: "exact" },
    );

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const {
    data: posts,
    error,
    count,
  } = await query.order("created_at", { ascending: false }).range(from, to);

  const typedPosts = posts as unknown as Post[] | null;
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (error) {
    console.error("Error fetching posts:", error);
  }

  async function handleSearch(formData: FormData) {
    "use server";
    const searchTerm = formData.get("search") as string;
    if (searchTerm) {
      redirect(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      redirect("/");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-[family-name:var(--font-noto-sans-kr)]">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-zinc-200 dark:border-zinc-800">
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="font-[family-name:var(--font-fredoka)] text-xl text-primary font-semibold tracking-wider">
                  Don&apos;t Worry Board
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 tracking-[-0.02em] leading-none">
                  고민 게시판
                </h1>
              </div>
              <div className="space-y-1">
                <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
                  당신의 고민을 나누고 따뜻한 조언을 얻으세요.
                </p>
                {userNickname && (
                  <p className="text-sm text-zinc-400 dark:text-zinc-500 animate-in fade-in slide-in-from-left-4 duration-500">
                    안녕하세요, <span className="text-primary font-bold">{userNickname}</span>님
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <form action={logout}>
                    <Button variant="ghost" type="submit" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-bold transition-colors">
                      로그아웃
                    </Button>
                  </form>
                  <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/20 font-bold px-6">
                    <Link href="/posts/new">새 고민 작성</Link>
                  </Button>
                </>
              ) : (
                <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/20 font-bold px-8">
                  <Link href="/login">로그인</Link>
                </Button>
              )}
            </div>
          </header>

          {/* Search Bar */}
          <form action={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <Input
              name="search"
              placeholder="제목이나 내용으로 검색하기..."
              defaultValue={search || ""}
              className="pl-12 h-14 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm group-focus-within:ring-2 group-focus-within:ring-primary/20 transition-all text-lg"
            />
          </form>

          {/* Post Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            {typedPosts && typedPosts.length > 0 ? (
              <>
                {typedPosts.map((post, index) => (
                  <Link key={post.id} href={`/posts/${post.id}`} className="block transition-transform hover:-translate-y-1 duration-300">
                    <PostCard post={post} priority={index < 4} />
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
                      <Link href={`/?page=${currentPage - 1}${search ? `&search=${search}` : ""}`}>
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
                          <Link href={`/?page=${p}${search ? `&search=${search}` : ""}`}>{p}</Link>
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
                      <Link href={`/?page=${currentPage + 1}${search ? `&search=${search}` : ""}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500 dark:text-zinc-400">
                  {search ? "검색 결과가 없습니다." : "No posts yet."}
                </p>
                {!search && (
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/posts/new">Be the first to share a worry!</Link>
                  </Button>
                )}
                {search && (
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/">전체 목록 보기</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
