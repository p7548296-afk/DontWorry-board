-- 1. posts 테이블 생성
CREATE TABLE public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. comments 테이블 생성
CREATE TABLE public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 3. RLS(Row Level Security) 설정
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 4. posts 정책(Policies) 설정

-- 모든 사용자가 게시글을 조회할 수 있음
CREATE POLICY "Posts are viewable by everyone" 
ON public.posts FOR SELECT 
USING (true);

-- 인증된 사용자만 게시글을 생성할 수 있음
CREATE POLICY "Authenticated users can insert posts" 
ON public.posts FOR INSERT 
WITH CHECK (auth.uid() = author_id);

-- 자신의 게시글만 수정할 수 있음
CREATE POLICY "Users can update their own posts" 
ON public.posts FOR UPDATE 
USING (auth.uid() = author_id);

-- 자신의 게시글만 삭제할 수 있음
CREATE POLICY "Users can delete their own posts" 
ON public.posts FOR DELETE 
USING (auth.uid() = author_id);

-- 5. comments 정책(Policies) 설정

-- 모든 사용자가 댓글을 조회할 수 있음
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT 
USING (true);

-- 인증된 사용자만 댓글을 생성할 수 있음
CREATE POLICY "Authenticated users can insert comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = author_id);

-- 자신의 댓글만 수정할 수 있음
CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = author_id);

-- 자신의 댓글만 삭제할 수 있음
CREATE POLICY "Users can delete their own comments" 
ON public.comments FOR DELETE 
USING (auth.uid() = author_id);

-- 6. updated_at 자동 업데이트 트리거 (posts 전용)
CREATE TRIGGER on_posts_updated
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
