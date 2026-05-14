# DOMAIN POST STATUTE

## 규칙
- `posts` 테이블 구조:
  - `id`: uuid (primary key)
  - `author_id`: uuid (profiles.id 외래키)
  - `title`: text (not null)
  - `content`: text (not null)
  - `created_at`: timestamp
- 게시글 목록 조회 시 작성자의 `nickname`을 함께 가져온다.
