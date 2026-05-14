'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nickname = formData.get('nickname') as string

  // 1. Auth 회원가입
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  const user = data.user
  if (!user) {
    return { error: '회원가입 중 오류가 발생했습니다.' }
  }

  // 2. Profiles 테이블 연동
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        id: user.id,
        nickname,
      },
    ])

  if (profileError) {
    // 프로필 생성 실패 시 Auth 계정 삭제를 고려할 수 있으나, 
    // 여기서는 간단히 에러를 반환합니다. 
    // (실제 운영 환경에서는 트랜잭션 처럼 동작하도록 고려 필요)
    return { error: '프로필 생성 중 오류가 발생했습니다: ' + profileError.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
