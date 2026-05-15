'use client'

import { useState, useTransition, useRef } from 'react'
import { createPost } from '@/app/posts/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Image as ImageIcon, Loader2 } from 'lucide-react'

export function PostForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const totalImages = selectedImages.length + files.length
    if (totalImages > 5) {
      setError('최대 5장까지만 업로드 가능합니다.')
      return
    }

    // 파일 유효성 검사
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`허용되지 않는 파일 형식입니다: ${file.name} (jpg, png, webp만 가능)`);
        return;
      }
      if (file.size > MAX_SIZE) {
        setError(`파일 크기는 5MB를 초과할 수 없습니다: ${file.name}`);
        return;
      }
    }

    const newSelectedImages = [...selectedImages, ...files]
    setSelectedImages(newSelectedImages)

    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls([...previewUrls, ...newPreviewUrls])
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setError(null)
  }

  const removeImage = (index: number) => {
    const newSelectedImages = selectedImages.filter((_, i) => i !== index)
    setSelectedImages(newSelectedImages)

    URL.revokeObjectURL(previewUrls[index])
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index)
    setPreviewUrls(newPreviewUrls)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    selectedImages.forEach(image => {
      formData.append('images', image)
    })

    startTransition(async () => {
      try {
        await createPost(formData)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError('An unknown error occurred.')
        }
      }
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Share Your Worry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              required
              disabled={isPending}
              className="text-lg font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Images ({selectedImages.length}/5)</Label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                    disabled={isPending}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {selectedImages.length < 5 && (
                <div 
                  className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2" />
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">Add Image</p>
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your worry in detail. Others are here to listen and offer advice."
              required
              className="min-h-[250px] whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg"
              disabled={isPending}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-[120px]">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Worry'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
