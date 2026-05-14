# COMMENT Domain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement comment list and creation functionality on the post detail page.

**Architecture:** RSC for fetching comments, Server Actions for creation, and ShadCN UI for the interface.

**Tech Stack:** Next.js, TypeScript, Supabase, ShadCN UI.

---

### Task 1: Implement Comment Type Definitions

**Files:**
- Create: `types/comment.ts`

- [ ] **Step 1: Define Comment interface**
```typescript
export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles?: {
    nickname: string;
  };
}
```

### Task 2: Implement Comment Creation Server Action

**Files:**
- Modify: `app/posts/actions.ts`

- [ ] **Step 1: Add createComment action**
Check auth, validate content, insert into `comments`, and revalidate the post detail path.

### Task 3: Implement Comment Form Component

**Files:**
- Create: `components/comment-form.tsx`

- [ ] **Step 1: Create CommentForm client component**
Use ShadCN Textarea and Button. Call `createComment`. Handle loading states.

### Task 4: Implement Comment List Component

**Files:**
- Create: `components/comment-list.tsx`

- [ ] **Step 1: Create CommentList component**
Display comments with nickname, date, and content. Use a clean, minimal style.

### Task 5: Integrate Comments into Post Detail Page

**Files:**
- Modify: `app/posts/[id]/page.tsx`

- [ ] **Step 1: Fetch and display comments**
Update the detail page to fetch comments and render `CommentList` and `CommentForm`.

### Task 6: Final Verification

- [ ] **Step 1: Test comment flow**
Post a comment as a logged-in user and verify it appears.

- [ ] **Step 2: Test auth restriction**
Verify the form is hidden or restricted for logged-out users.
