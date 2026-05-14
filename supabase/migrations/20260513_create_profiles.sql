-- 1. profiles 테이블 생성
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text NOT NULL UNIQUE,
  updated_at timestamp with time zone DEFAULT now(),
  
  -- 닉네임 제약 조건: 2~10자, 영문/숫자/한글만 허용 (특수문자 제한)
  CONSTRAINT nickname_length CHECK (char_length(nickname) >= 2 AND char_length(nickname) <= 10),
  CONSTRAINT nickname_format CHECK (nickname ~* '^[a-zA-Z0-9가-힣]+$')
);

-- 2. RLS(Row Level Security) 설정
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. 정책(Policies) 설정

-- 모든 사용자가 프로필을 조회할 수 있음 (닉네임 노출용)
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- 인증된 사용자만 자신의 프로필을 생성할 수 있음
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 인증된 사용자만 자신의 프로필을 수정할 수 있음
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 4. updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
