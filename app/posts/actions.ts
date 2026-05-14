'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('인증이 필요합니다.')
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !content || title.trim() === '' || content.trim() === '') {
    throw new Error('제목과 내용을 입력해주세요.')
  }

  const { error } = await supabase.from('posts').insert({
    title,
    content,
    author_id: user.id,
  })

  if (error) {
    console.error('Error creating post:', error)
    throw new Error('게시글 작성 중 오류가 발생했습니다.')
  }

  revalidatePath('/')
  redirect('/')
}

export async function createComment(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('인증이 필요합니다.')
  }

  const postId = formData.get('postId') as string
  const content = formData.get('content') as string

  if (!postId || !content || content.trim() === '') {
    throw new Error('내용을 입력해주세요.')
  }

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    content,
    author_id: user.id,
  })

  if (error) {
    console.error('Error creating comment:', error)
    throw new Error('댓글 작성 중 오류가 발생했습니다.')
  }

  revalidatePath(`/posts/${postId}`)
}
