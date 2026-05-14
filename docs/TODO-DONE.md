# 완료된 작업

## 2026-05-14
- [x] 게시글 상세 페이지 댓글 통합 (`app/posts/[id]/page.tsx`)
- [x] 댓글 작성 Server Action 구현 (`app/posts/actions.ts`)
- [x] 댓글 도메인 타입 정의 추가 (`types/comment.ts`)
- [x] `app/login/page.tsx`의 lint 에러(`react/no-unescaped-entities`) 수정
- [x] 게시글 작성 Server Action 구현 (`app/posts/actions.ts`)
- [x] ShadCN UI textarea 컴포넌트 추가 (`components/ui/textarea.tsx`)
- [x] 게시글 작성 페이지 구현 (`app/posts/new/page.tsx`, `components/post-form.tsx`)
- [x] 댓글 작성 폼 컴포넌트 구현 (`components/comment-form.tsx`)
- [x] 댓글 목록 컴포넌트 구현 (`components/comment-list.tsx`)

## 2026-05-13
- [x] profiles 테이블 생성 및 RLS 설정 (`supabase/migrations/20260513_create_profiles.sql`)
- [x] posts, comments 테이블 생성 및 RLS 설정 (`supabase/migrations/20260513_create_posts_and_comments.sql`)
- [x] Supabase 클라이언트 설정 (`lib/supabase/`)
- [x] Middleware 세션 관리 설정 (`middleware.ts`, `lib/supabase/middleware.ts`)
- [x] 회원가입 페이지 구현 및 profiles 연동 (`app/signup/page.tsx`)
- [x] 로그인 페이지 구현 (`app/login/page.tsx`)
- [x] 인증 관련 Server Actions 구현 (`app/auth/actions.ts`)
