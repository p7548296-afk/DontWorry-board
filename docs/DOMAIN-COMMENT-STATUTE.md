# DOMAIN COMMENT STATUTE

## 규칙
- `comments` 테이블 구조:
  - `id`: uuid (primary key)
  - `post_id`: uuid (posts.id 외래키)
  - `author_id`: uuid (profiles.id 외래키)
  - `content`: text (not null)
  - `created_at`: timestamp
- 댓글은 게시글 상세 페이지에서 작성일 순(오름차순)으로 정렬한다.
- 댓글 목록은 페이지당 10개씩 페이징 처리하며, '이전/다음' 버튼을 제공한다. (Supabase `.range()` 사용)
