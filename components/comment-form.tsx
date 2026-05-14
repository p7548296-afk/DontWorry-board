'use client'

import { useState, useTransition } from 'react'
import { createComment } from '@/app/posts/actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface CommentFormProps {
  postId: string
}

export function CommentForm({ postId }: CommentFormProps) {
  const [isPending, startTransition] = useTransition()
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content.trim()) return

    const formData = new FormData()
    formData.append('postId', postId)
    formData.append('content', content)

    setError(null)
    startTransition(async () => {
      try {
        await createComment(formData)
        setContent('')
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('댓글 작성 중 오류가 발생했습니다.')
        }
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="따뜻한 위로의 말을 남겨주세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          className="min-h-[100px] resize-none"
        />
        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending || !content.trim()}
          className="w-full sm:w-auto"
        >
          {isPending ? '작성 중...' : '댓글 작성'}
        </Button>
      </div>
    </form>
  )
}
