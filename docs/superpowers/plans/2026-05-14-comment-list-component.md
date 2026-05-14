# Comment List Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `CommentList` component to display a list of comments for a post.

**Architecture:** A functional React component that takes an array of `Comment` objects and renders them in a clean, vertical list.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, ShadCN UI (Card).

---

### Task 1: Create CommentList component

**Files:**
- Create: `components/comment-list.tsx`

- [ ] **Step 1: Write the implementation code**

```tsx
import { Comment } from "@/types/comment";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No comments yet.</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const nickname = comment.profiles?.nickname || "Anonymous";
        const date = new Date(comment.created_at).toLocaleDateString();

        return (
          <Card key={comment.id} className="border-none shadow-none bg-muted/30">
            <CardHeader className="py-3">
              <CardDescription>
                <span className="font-semibold text-foreground">{nickname}</span> • {date}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-3 pt-0">
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify the component structure**
Ensure it uses `whitespace-pre-wrap` and correctly accesses `comment.profiles?.nickname`.

- [ ] **Step 3: Run linting**

Run: `npm run lint`
Expected: No errors related to `components/comment-list.tsx`.
