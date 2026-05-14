# Post Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a post detail page that fetches and displays a single post's title, content, nickname, and creation date.

**Architecture:** Next.js Server Component for server-side fetching using Supabase SSR client.

**Tech Stack:** Next.js, Supabase, Tailwind CSS, Lucide React.

---

### Task 1: Update Progress

**Files:**
- Modify: `docs/TODO-DOING.md`
- Modify: `docs/TODO-READY.md`

- [ ] **Step 1: Move Task 4 to DOING**
- [ ] **Step 2: Update CONTEXT.md with current focus**

### Task 2: Implement Post Detail Page

**Files:**
- Create: `app/posts/[id]/page.tsx`

- [ ] **Step 1: Create basic structure and fetch data**
```tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Post } from "@/types/post";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

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
    notFound();
  }

  const typedPost = post as unknown as Post;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-8 -ml-4 text-zinc-600 dark:text-zinc-400">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to List
          </Link>
        </Button>

        <article className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
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
                {new Date(typedPost.created_at).toLocaleDateString("ko-KR", {
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
      </div>
    </div>
  );
}
```

### Task 3: Finalize Task

**Files:**
- Modify: `docs/TODO-DONE.md`
- Modify: `docs/TODO-DOING.md`
- Modify: `docs/AI-ACTION-LOGS.md`

- [ ] **Step 1: Move Task 4 to DONE**
- [ ] **Step 2: Add log entry**
