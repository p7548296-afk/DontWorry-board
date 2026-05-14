# 2026-05-14 POST Domain Design

## Goal
Implement a post management system (list, detail, creation) that respects anonymity and encourages honest communication.

## User Requirements
- `app/page.tsx`: Post list with author nickname.
- `app/posts/new/page.tsx`: Post creation page (authenticated users only).
- `app/posts/[id]/page.tsx`: Post detail page.

## Architecture
- **Framework**: Next.js App Router (React Server Components).
- **Backend**: Supabase (Postgres, RLS).
- **Data Fetching**: Server-side fetching for list and detail pages.
- **Data Mutation**: Server Actions for post creation.
- **UI**: ShadCN UI (Card, Button, Input, Textarea, Label).

## Data Flow
1. **List Page**: Fetch `posts` joined with `profiles` to get `nickname`. Sort by `created_at` descending.
2. **Detail Page**: Fetch single `post` by `id` with author `nickname`.
3. **Creation Page**: 
    - Check session on server side.
    - Submit form via Server Action.
    - Insert into `posts` table (author_id is automatically validated via RLS or manual check).
    - Redirect to list page or detail page on success.

## UI Components (ShadCN)
- `PostCard`: Displays `title`, `nickname`, `created_at`, and a preview of `content`.
- `PostForm`: Form with validation for `title` and `content`.

## Error Handling
- Validation errors for empty fields.
- Authentication errors (unauthorized access to `/posts/new`).
- Database errors (display toast or error message).

## Testing Strategy
- Verify post list displays correct data.
- Verify post detail page loads for valid IDs.
- Verify unauthorized users cannot access creation page or submit posts.
