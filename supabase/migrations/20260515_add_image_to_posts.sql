-- 1. posts 테이블에 image_url 컬럼 추가
ALTER TABLE public.posts ADD COLUMN image_url text;

-- 2. Supabase Storage 버킷 생성 및 정책 설정
-- 'post-images' 버킷 생성 (존재하지 않을 경우를 대비해 스크립트 작성)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 정책 설정

-- 모든 사용자가 이미지를 조회할 수 있음
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'post-images');

-- 인증된 사용자만 이미지를 업로드할 수 있음
CREATE POLICY "Authenticated users can upload images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'post-images' AND 
  auth.role() = 'authenticated'
);

-- 자신의 이미지만 삭제할 수 있음
CREATE POLICY "Users can delete their own images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'post-images' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
