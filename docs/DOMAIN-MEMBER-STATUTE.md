# DOMAIN MEMBER STATUTE

## 규칙
- `profiles` 테이블 구조:
  - `id`: uuid (Auth.users.id 외래키)
  - `nickname`: text (unique, not null)
  - `updated_at`: timestamp
- 닉네임 제약 조건:
  - 최소 2자, 최대 10자
  - 특수문자 제한
