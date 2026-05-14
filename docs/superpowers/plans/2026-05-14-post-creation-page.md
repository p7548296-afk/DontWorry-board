# Post Creation Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the post creation page and its associated form component to allow authenticated users to submit new worry posts.

**Architecture:** A server-side page (`app/posts/new/page.tsx`) handles authentication and layout, while a client-side component (`components/post-form.tsx`) manages form state, validation, and submission via a Server Action.

**Tech Stack:** Next.js (App Router), Supabase (Auth/Database), ShadCN UI (Input, Textarea, Button, Card), Tailwind CSS, TypeScript.

---

### Task 1: Create PostForm Component

**Files:**
- Create: `components/post-form.tsx`

- [ ] **Step 1: Implement the PostForm client component**

```tsx
'use client'

import { useState, useTransition } from 'react'
import { createPost } from '@/app/posts/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PostForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await createPost(formData)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError('알 수 없는 오류가 발생했습니다.')
        }
      }
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>고민 나누기</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              placeholder="무엇이 고민인가요?"
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="고민을 자세히 적어주세요. 따뜻한 조언을 해줄 분들이 기다리고 있어요."
              required
              className="min-h-[200px]"
              disabled={isPending}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? '등록 중...' : '등록하기'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

### Task 2: Create New Post Page

**Files:**
- Create: `app/posts/new/page.tsx`

- [ ] **Step 1: Implement the New Post page with auth check**

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PostForm } from '@/components/post-form'

export default async function NewPostPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container py-10">
      <PostForm />
    </div>
  )
}
```

### Task 3: Verification

- [ ] **Step 1: Verify the build**

Run: `npm run build`
Expected: SUCCESS

- [ ] **Step 2: Manual verification (Optional/Instructional)**
1. Access `/posts/new` while logged out -> Should redirect to `/login`.
2. Access `/posts/new` while logged in -> Should show the form.
3. Submit a post -> Should redirect to home page and show the new post.
