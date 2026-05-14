# 2026-05-14 COMMENT Domain Design

## Goal
Implement a comment system for posts that allows users to provide warm advice and consolation, respecting the project's anonymity and honest communication principles.

## User Requirements
- Display a list of comments on the post detail page (`app/posts/[id]/page.tsx`).
- Allow authenticated users to write comments.
- Display author nicknames for each comment.

## Architecture
- **Framework**: Next.js App Router.
- **Backend**: Supabase.
- **Data Fetching**: Server-side fetching within the post detail page.
- **Data Mutation**: Server Actions for comment creation.
- **UI**: ShadCN UI (Button, Textarea, Card).

## Data Flow
1. **Fetch Comments**: When loading `app/posts/[id]/page.tsx`, fetch `comments` for the current `post_id` joined with `profiles`.
2. **Sort**: Order by `created_at` ascending.
3. **Create Comment**: 
    - Check session on the server.
    - Submit via Server Action.
    - Insert into `comments` table.
    - Revalidate post detail page path.

## UI Components
- `CommentList`: Displays individual comments with nickname and date.
- `CommentForm`: A form for writing new comments, visible to authenticated users.

## Error Handling
- Prevent empty comments.
- Handle authentication errors (redirect or show message).
- Database insertion errors.

## Testing Strategy
- Verify comments are correctly linked to posts.
- Verify author nicknames are displayed.
- Verify only logged-in users can post comments.
