# 완료된 작업

## 구현 완료 현황

### 핵심 기능

- ✅ **인증 시스템**: 이메일 기반 회원가입 및 로그인 (Supabase Auth)
- ✅ **사용자 프로필**: 닉네임 설정 및 관리 (profiles 테이블)
- ✅ **게시글 관리**: 전체 CRUD 기능 (작성, 조회, 수정, 삭제)
- ✅ **댓글 기능**: 댓글 작성, 조회, 삭제
- ✅ **이미지 업로드**: 게시글 다중 이미지 업로드 (최대 5장, 파일 검증, 자동 정리)
- ✅ **이미지 뷰어**: 라이트박스 기능으로 원본 크기 이미지 보기
- ✅ **게시글 목록**: 썸네일 표시 및 UI 최적화

### 구현된 UI 컴포넌트

- ✅ Button, Input, Label, Card, Dialog, TextArea 등 기본 UI
- ✅ PostCard (게시글 카드)
- ✅ PostForm (게시글 작성 폼)
- ✅ PostOwnerEditor (게시글 수정 폼)
- ✅ CommentForm (댓글 작성 폼)
- ✅ CommentList (댓글 목록)
- ✅ CommentOwnerActions (댓글 소유자 액션)
- ✅ Lightbox (이미지 뷰어)

### 데이터베이스

- ✅ profiles 테이블 (사용자 정보)
- ✅ posts 테이블 (게시글, 다중 이미지 지원)
- ✅ comments 테이블 (댓글)
- ✅ RLS 정책 설정 (행 수준 보안)

---

## 2026-05-15

- [x] 게시글 이미지 업로드 기능 구현
  - Supabase Storage `post-images` 버킷 생성 및 RLS 정책 설정
  - `posts` 테이블에 `image_url` 컬럼 추가
  - 게시글 작성 시 이미지 업로드 로직 추가 (`app/posts/actions.ts`, `components/post-form.tsx`)
  - 게시글 상세 페이지 이미지 표시 (`app/posts/[id]/page.tsx`, `components/post-owner-editor.tsx`)
- [x] 게시글 수정 시 이미지 변경/삭제 기능 구현
- [x] 게시글 다중 이미지 업로드 기능 구현 (최대 5장)
  - `posts` 테이블 `image_url`을 `image_urls` (text[])로 변경하는 마이겨레이션 수행
  - 게시글 작성/수정 시 다중 이미지 미리보기 및 개별 삭제 기능 구현
  - Server Action에서 일괄 업로드 및 스토리지 정리 로직 고도화
- [x] 이미지 관리 강화 및 UX 개선
  - 파일 유효성 검사 추가 (JPG, PNG, WEBP 허용 / 파일당 최대 5MB 제한)
  - 업로드 중 로딩 상태 표시 (Loader 스피너 적용)
  - 게시글 삭제 시 관련 모든 이미지를 Supabase Storage에서 자동 삭제
  - 이미지 클릭 시 원본 크기로 볼 수 있는 라이트박스(Lightbox) 기능 구현
- [x] UI 레이아웃 최적화 및 썸네일 적용
  - 게시글 상세 페이지: 글 내용이 이미지보다 먼저 오도록 순서 변경 (`PostDetailPage`, `PostOwnerEditor`)
  - 게시글 목록: 텍스트 미리보기를 제거하고 첫 번째 이미지를 썸네일로 표시 (`PostCard`)
- [x] `components/post-owner-editor.tsx` JSX 문법 에러 수정 및 안정화
- [x] `next.config.ts` Server Actions `bodySizeLimit`을 20MB로 상향 조정
- [x] `app/page.tsx`, `app/signup/page.tsx`의 lint 에러(`react/no-unescaped-entities`) 수정

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
