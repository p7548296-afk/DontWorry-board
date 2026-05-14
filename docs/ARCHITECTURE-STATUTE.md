# ARCHITECTURE STATUTE

## 디렉토리 구조 (표준 구조)
- `app/`: Next.js App Router 기반 라우팅 및 페이지
- `components/`: 재사용 가능한 UI 컴포넌트
  - `ui/`: ShadCN UI 컴포넌트
  - `shared/`: 여러 도메인에서 공통으로 사용되는 컴포넌트
- `lib/`: 유틸리티, 외부 서비스 설정 (Supabase 클라이언트 등)
- `hooks/`: 커스텀 React Hooks
- `types/`: 전역 TypeScript 타입 정의
- `services/`: API 호출 및 외부 비즈니스 로직

## 구현 규칙
- 컴포넌트는 가급적 함수형 컴포넌트와 Server/Client Component를 구분하여 작성한다.
- 데이터베이스 접근은 Supabase 클라이언트를 통해 수행한다.
