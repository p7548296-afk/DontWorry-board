# Don't Worry Board

고민을 나누고 따뜻한 조언을 주고받는 익명 고민 상담 게시판입니다.

## 🔗 링크

- **배포 URL:** https://dont-worry-board.vercel.app
- **GitHub:** https://github.com/p7548296-afk/DontWorry-board

## 🚀 주요 기능

### 1. 게시글 관리 (CRUD)
- **고민 작성:** 제목, 본문 내용과 함께 이미지를 업로드하여 고민을 공유할 수 있습니다.
- **다중 이미지 업로드:** 게시글당 최대 **5장**의 이미지를 첨부할 수 있습니다.
- **이미지 관리:** 업로드 전 미리보기 및 개별 삭제가 가능하며, 수정 시 기존 이미지를 교체하거나 삭제할 수 있습니다.
- **이미지 썸네일:** 목록 페이지에서 게시글의 첫 번째 이미지를 썸네일로 보여줍니다.
- **이미지 라이트박스:** 상세 페이지에서 이미지를 클릭하면 원본 크기로 크게 볼 수 있는 모달 뷰어 기능을 제공합니다.

### 2. 댓글 기능
- **조언 남기기:** 게시글에 자유롭게 의견이나 응원의 메시지를 남길 수 있습니다.
- **실시간 소통:** 댓글 작성, 수정, 삭제 시 페이지가 즉시 갱신되어 원활한 소통을 지원합니다.

### 3. 사용자 인증
- **회원가입/로그인:** Supabase Auth를 이용한 안전한 이메일 기반 인증을 지원합니다.
- **공개 프로필:** 사용자는 고유한 닉네임을 설정하여 활동합니다.
- **권한 관리:** 본인이 작성한 게시글과 댓글만 수정 및 삭제가 가능하도록 RLS(Row Level Security) 보안 정책이 적용되어 있습니다.

## 🛠 기술 스택

- **Framework:** Next.js 16 (App Router)
- **Database & Auth:** Supabase (PostgreSQL, Auth, Storage)
- **Styling:** Tailwind CSS, ShadCN UI, Lucide React
- **Language:** TypeScript
- **State Management:** React Server Actions, `useTransition`

## ⚙️ 이미지 처리 상세

- **허용 형식:** JPG, PNG, WEBP
- **용량 제한:** 파일당 최대 **5MB**
- **저장소:** Supabase Storage (`post-images` 버킷)
- **자동 정리:** 게시글 삭제 시 해당 게시글과 연관된 모든 이미지 파일이 스토리지에서 자동으로 삭제됩니다.

## 📦 시작하기

1. **저장소 클론:**
```bash
   git clone https://github.com/p7548296-afk/DontWorry-board.git
   cd DontWorry-board
```

2. **의존성 설치:**
```bash
   npm install
```

3. **환경 변수 설정:**
   `.env.local` 파일을 생성하고 Supabase 프로젝트 정보를 입력합니다.
```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **개발 서버 실행:**
```bash
   npm run dev
```

---
본 프로젝트는 사용자의 고민을 소중히 여기며, 안전하고 쾌적한 커뮤니티 환경을 제공하기 위해 노력하고 있습니다.