# AI 작업 로그

## 2026-05-15
1. 게시글 다중 이미지 업로드 기능 구현 (최대 5장)
   - `supabase/migrations/20260515_change_to_multiple_images.sql`: `posts` 테이블의 `image_url`을 `image_urls` (text[])로 변경
   - `app/posts/actions.ts`: `createPost`, `updatePost`, `deletePost` 액션이 다중 이미지를 처리하도록 로직 전면 수정 (개별 삭제 및 일괄 스토리지 관리 포함)
   - `components/post-form.tsx` & `components/post-owner-editor.tsx`: 다중 이미지 미리보기, 개별 삭제, 최대 5장 제한 로직이 포함된 UI로 리팩토링
2. 설정 및 안정화
   - `next.config.ts`: 대용량 이미지 업로드를 위해 `bodySizeLimit`을 20MB로 상향
   - `components/post-owner-editor.tsx`: 보고된 JSX 파싱 에러를 수정하고 파일 구조를 안정화
   - TypeScript 타입 에러(implicit any) 해결 및 린트 검증 완료
3. 이미지 관리 기능 강화 및 라이트박스 구현
   - **유효성 검사:** `actions.ts` 및 클라이언트 컴포넌트에서 파일 형식(JPG, PNG, WEBP) 및 용량(파일당 5MB) 제한 로직 추가.
   - **스토리지 정리:** `deletePost` 시 게시글에 포함된 모든 이미지를 Supabase Storage에서 일괄 삭제하도록 개선.
   - **UX 개선:** 이미지 업로드 및 게시글 저장 시 `Loader2` 스피너를 적용하여 진행 상태 표시.
   - **라이트박스:** Radix UI Dialog를 기반으로 한 `Lightbox` 컴포넌트 구현. 게시글 상세 페이지에서 이미지를 클릭하면 원본 크기의 모달 뷰어 제공.
4. UI 레이아웃 최적화 및 썸네일 적용
   - 게시글 상세 페이지 (`app/posts/[id]/page.tsx`, `components/post-owner-editor.tsx`): 글 내용을 이미지보다 상단으로 배치하여 가독성을 높임.
   - 게시글 목록 (`components/post-card.tsx`): 텍스트 미리보기를 제거하고 첫 번째 이미지가 있을 경우 썸네일로 표시하도록 변경. 카드 레이아웃을 반응형(모바일 세로, 데스크톱 가로)으로 조정.
4. 전역적인 lint 에러 수정 (`app/page.tsx`, `app/signup/page.tsx`)
   - `Don't Worry Board` 텍스트에서 apostrophe가 올바르게 escape 되지 않아 발생하는 `react/no-unescaped-entities` 에러 해결

## 2026-05-14
1. 댓글 작성 폼 컴포넌트 구현 (`components/comment-form.tsx`)
   - ShadCN UI의 Textarea와 Button을 사용
   - `useTransition`을 활용하여 제출 중 로딩 상태 표시
   - 클라이언트 사이드 기본 유효성 검사 (빈 내용 제출 방지) 구현
   - 제출 성공 시 입력 필드 초기화 로직 추가

2. 게시글 상세 페이지 구현 (`app/posts/[id]/page.tsx`)
   - Supabase를 통한 게시글 단건 조회 및 작성자 닉네임 연동
   - 게시글 레이아웃 및 스타일링 구현

3. 댓글 작성 Server Action 구현 (`app/posts/actions.ts`)
   - Supabase `comments` 테이블에 데이터 삽입 로직 구현
   - `revalidatePath`를 통한 실시간 페이지 갱신 설정

4. 게시글 작성 페이지 구현 (`app/posts/new/page.tsx`, `components/post-form.tsx`)
   - `PostForm` 컴포넌트 개발 및 Server Action 연동

5. ShadCN UI 컴포넌트 추가
   - `textarea.tsx`, `card.tsx` 등 필요한 UI 컴포넌트 라이브러리 추가

6. 댓글 목록 컴포넌트 구현 (`components/comment-list.tsx`)
   - 댓글 목록을 받아 닉네임, 날짜, 내용을 표시하는 기능 구현
   - `whitespace-pre-wrap`을 적용하여 줄바꿈 보존
   - 깔끔한 카드 스타일 레이아웃 적용

7. 게시글 상세 페이지 댓글 통합 (`app/posts/[id]/page.tsx`)
   - 댓글 데이터 조회(닉네임 포함) 및 시간순 정렬 구현
   - 사용자 인증 상태 확인 로직 추가
   - 인증된 사용자에게는 `CommentForm` 표시, 비인증 사용자에게는 로그인 유도 메시지 표시
   - `CommentList`를 통한 댓글 목록 출력 연동
