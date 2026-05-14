# POST Domain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement post list, detail, and creation pages with Supabase integration and ShadCN UI.

**Architecture:** Next.js App Router with RSC for fetching and Server Actions for mutations. Database RLS ensures security.

**Tech Stack:** Next.js, TypeScript, Supabase, ShadCN UI, Tailwind CSS.

---

### Task 1: Initialize ShadCN UI Components

**Files:**
- Create: `components/ui/textarea.tsx` (using shadcn-ui cli)

- [ ] **Step 1: Add Textarea component**
Run: `npx shadcn-ui@latest add textarea`

- [ ] **Step 2: Verify component exists**
Check: `components/ui/textarea.tsx`

### Task 2: Implement Post Type Definitions

**Files:**
- Create: `types/post.ts`

- [x] **Step 1: Define Post and Profile types**
```typescript
export interface Post {
  id: string;
  author_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    nickname: string;
  };
}
```

### Task 3: Implement Post List Page (app/page.tsx)

**Files:**
- Modify: `app/page.tsx`
- Create: `components/post-card.tsx`

- [ ] **Step 1: Create PostCard component**
Use ShadCN Card to display title, nickname, preview, and date.

- [ ] **Step 2: Update landing page to fetch and list posts**
Fetch posts joined with profiles. Use `lib/supabase/server.ts`.

### Task 4: Implement Post Detail Page (app/posts/[id]/page.tsx)

**Files:**
- Create: `app/posts/[id]/page.tsx`

- [ ] **Step 1: Create detail page with server-side fetching**
Fetch a single post by ID including nickname. Display full content.

### Task 5: Implement Post Creation Server Action

**Files:**
- Create: `app/posts/actions.ts`

- [ ] **Step 1: Create createPost action**
Check auth session, validate input, insert into `posts`, and redirect.

### Task 6: Implement Post Creation Page (app/posts/new/page.tsx)

**Files:**
- Create: `app/posts/new/page.tsx`
- Create: `components/post-form.tsx`

- [ ] **Step 1: Create PostForm client component**
Use ShadCN Input, Textarea, and Button. Call the `createPost` action.

- [ ] **Step 2: Create New Post page**
Verify authentication on the server before rendering the form. Redirect to login if not authenticated.

### Task 7: Final Verification and UI Polish

- [ ] **Step 1: Verify all links**
Ensure landing page links to detail pages and "New Post" page.

- [ ] **Step 2: Test auth flow**
Ensure non-logged-in users are redirected from `/posts/new`.
