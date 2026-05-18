# DontWorry-board

고민을 나누고 따뜻한 조언을 주고받는 익명 고민 상담 게시판입니다.

---

# 프로젝트 개요

- **프로젝트 목적:** 누구나 닉네임 기반으로 익명성을 유지하며 일상의 크고 작은 고민을 나눌 수 있는 커뮤니티 서비스
- **주요 기능 설명:** 게시글/댓글 CRUD, 이미지 업로드, 검색, 페이지네이션
- **어떤 문제를 해결하는지:** 익명으로 고민을 올리고 다른 사람들의 조언을 받을 수 있는 공간 제공
- **프로젝트 진행 배경:** 처음에는 식사 메뉴 고민에 대한 답을 구하고 싶다는 생각에서 시작했고, 이를 확장하여 누구나 일상의 크고 작은 고민을 익명으로 나눌 수 있는 게시판으로 발전시켰습니다.

---

# 기술 스택

## Frontend

- Next.js 16 (App Router)
- TypeScript
- TailwindCSS
- ShadCN UI

## Backend

- Supabase (PostgreSQL, Auth, Storage, RLS)

## AI Agent

- Gemini CLI

---

# 주요 기능

- 이메일 기반 회원가입 / 로그인 / 로그아웃 (닉네임 중심 식별)
- 게시글 작성 / 수정 / 삭제 / 상세 조회 (이미지 최대 5장 첨부)
- 댓글 작성 / 수정 / 삭제 / 조회
- 게시글 목록 (이미지 썸네일 + 댓글 수 표시)
- 게시글 검색 (제목/내용)
- 게시글/댓글 페이지네이션

---

# 프로젝트 구조

```text
app/
├── auth/actions.ts
├── login/page.tsx
├── signup/page.tsx
├── posts/
│   ├── [id]/page.tsx
│   ├── actions.ts
│   └── new/page.tsx
└── page.tsx
components/
├── ui/
├── lightbox.tsx
├── post-card.tsx
├── post-form.tsx
├── post-owner-editor.tsx
├── comment-form.tsx
├── comment-list.tsx
└── comment-owner-actions.tsx
lib/
└── supabase/
```

---

# 실행 방법

## 1. 프로젝트 설치

```bash
git clone https://github.com/p7548296-afk/DontWorry-board.git
cd DontWorry-board
npm install
```

## 2. 환경변수 설정

`.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. 실행

```bash
npm run dev
```

---

# Supabase 설정

- **Authentication:** 이메일/비밀번호 기반 인증 사용
- **사용한 테이블:**

| 테이블     | 컬럼                                                              |
| ---------- | ----------------------------------------------------------------- |
| `profiles` | id, nickname, updated_at                                          |
| `posts`    | id, author_id, title, content, image_urls, created_at, updated_at |
| `comments` | id, post_id, author_id, content, created_at                       |

- **RLS 정책:** SELECT는 전체 공개, INSERT/UPDATE/DELETE는 본인만 가능
- **Storage:** `post-images` 버킷 사용 (게시글당 최대 5장, 파일당 최대 5MB)

---

# AI 에이전트 활용 방식

- **사용한 도구:** Gemini CLI
- **어떤 작업에 활용했는지:** 프로젝트 초기 세팅, 컴포넌트 생성, 기능 구현, 버그 수정, 문서 정리
- **문서 기반 작업 방식:** docs 폴더에 도메인별 규칙 문서(CONSTITUTION, STATUTE)를 작성하고 Gemini CLI가 이를 참고하여 일관된 코드를 생성
- **프롬프트 전략:** 구현할 기능과 참고할 문서 경로를 함께 명시하여 프로젝트 컨텍스트를 유지
- **코드 검증 방식:** 생성된 코드를 로컬에서 직접 실행하여 동작 확인 후 배포

---

# 트러블 슈팅

## 문제 상황

Vercel 배포 시 Turbopack이 한글 경로(`부트캠프`)를 처리하지 못해 빌드 실패

## 원인

프로젝트 경로에 한글이 포함되어 있어 Turbopack 내부에서 문자 인코딩 오류 발생

## 해결 방법

프로젝트 폴더를 한글 없는 경로(`bootcamp`)로 이동 후 git을 새로 초기화하여 루트 경로에서 push

---

# 회고

- **어려웠던 점:** Vercel 배포 과정에서 한글 경로로 인한 Turbopack 빌드 오류 해결
- **개선하고 싶은 점:** 마이페이지, 이용규칙 공지 등 고도화 기능 추가
- **새롭게 배운 점:** Next.js App Router의 Server Component / Server Action 패턴, Supabase RLS 설정
- **AI 에이전트를 사용하며 느낀 점:** 문서 기반으로 컨텍스트를 유지하면 AI가 일관된 코드를 생성할 수 있음

---

# 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [ShadCN UI 공식 문서](https://ui.shadcn.com)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
