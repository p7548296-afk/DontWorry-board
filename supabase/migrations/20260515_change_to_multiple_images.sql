-- 1. posts 테이블의 image_url 컬럼을 image_urls 배열 컬럼으로 변경
ALTER TABLE public.posts DROP COLUMN IF EXISTS image_url;
ALTER TABLE public.posts ADD COLUMN image_urls text[] DEFAULT '{}'::text[];

-- 2. (참고) Storage 정책은 이미 'post-images' 버킷에 대해 설정되어 있으므로 추가 작업 불필요
