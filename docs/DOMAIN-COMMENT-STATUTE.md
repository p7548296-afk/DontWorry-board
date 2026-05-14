# DOMAIN COMMENT STATUTE

## 규칙
- `comments` 테이블 구조:
  - `id`: uuid (primary key)
  - `post_id`: uuid (posts.id 외래키)
  - `author_id`: uuid (profiles.id 외래키)
  - `content`: text (not null)
  - `created_at`: timestamp
