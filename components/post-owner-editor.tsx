"use client";

import { deletePost, updatePost } from "@/app/posts/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useTransition, useRef, useEffect } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { PostImageGallery } from "@/components/post-image-gallery";

interface PostOwnerEditorProps {
  postId: string;
  initialTitle: string;
  initialContent: string;
  authorNickname: string;
  createdAt: string;
  imageUrls: string[];
}

export function PostOwnerEditor({
  postId,
  initialTitle,
  initialContent,
  authorNickname,
  createdAt,
  imageUrls,
}: PostOwnerEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  
  // 기존 이미지 관리
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>(imageUrls || []);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  
  // 새 이미지 관리
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  // 컴포넌트 언마운트 시 프리뷰 URL 메모리 해제
  useEffect(() => {
    return () => {
      newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newPreviewUrls]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalCount = currentImageUrls.length + newImages.length + files.length;
    if (totalCount > 5) {
      setError("최대 5장까지만 업로드 가능합니다.");
      return;
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

    setNewImages(prev => [...prev, ...files]);
    const urls = files.map(file => URL.createObjectURL(file));
    setNewPreviewUrls(prev => [...prev, ...urls]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
  };

  const removeCurrentImage = (url: string) => {
    setCurrentImageUrls(prev => prev.filter(u => u !== url));
    setDeletedImageUrls(prev => [...prev, url]);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviewUrls[index]);
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = () => {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("postId", postId);
        formData.append("title", title);
        formData.append("content", content);
        
        newImages.forEach(file => {
          formData.append("images", file);
        });
        
        deletedImageUrls.forEach(url => {
          formData.append("deletedImageUrls", url);
        });

        await updatePost(formData);
        
        // 성공 시 상태 정리
        setIsEditing(false);
        setNewImages([]);
        setNewPreviewUrls([]);
        setDeletedImageUrls([]);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          return;
        }
        setError("게시글 수정 중 오류가 발생했습니다.");
      }
    });
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setContent(initialContent);
    setCurrentImageUrls(imageUrls || []);
    setDeletedImageUrls([]);
    
    newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setNewImages([]);
    setNewPreviewUrls([]);
    
    setError(null);
    setIsEditing(false);
  };

  const handleDelete = () => {
    const shouldDelete = window.confirm("게시글을 삭제하시겠습니까?");
    if (!shouldDelete) return;

    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("postId", postId);
        await deletePost(formData);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          return;
        }
        setError("게시글 삭제 중 오류가 발생했습니다.");
      }
    });
  };

  return (
    <>
      <header className="mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-8">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPending}
                className="text-lg font-medium"
                placeholder="제목을 입력하세요"
              />
            </div>
          </div>
        ) : (
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">
            {title}
          </h1>
        )}

        <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm mt-4">
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {authorNickname}
          </span>
          <span className="mx-2 text-zinc-300 dark:text-zinc-700">•</span>
          <time dateTime={createdAt}>
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      <div className="space-y-8">
        {isEditing ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-content" className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Content</Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isPending}
                className="min-h-[300px] whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg"
                placeholder="내용을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-500 text-xs uppercase tracking-wider font-bold">
                Images ({currentImageUrls.length + newImages.length}/5)
              </Label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* 기존 이미지 */}
                {currentImageUrls.map((url, index) => (
                  <div key={`current-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 group">
                    <img
                      src={url}
                      alt={`Current ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeCurrentImage(url)}
                      disabled={isPending}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {/* 새 이미지 미리보기 */}
                {newPreviewUrls.map((url, index) => (
                  <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 group">
                    <img
                      src={url}
                      alt={`New Preview ${index + 1}`}
                      className="w-full h-full object-cover border-2 border-primary/20"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeNewImage(index)}
                      disabled={isPending}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="absolute bottom-1 left-1 bg-primary text-[10px] text-primary-foreground px-1 rounded font-bold">NEW</div>
                  </div>
                ))}
                
                {/* 추가 버튼 */}
                {currentImageUrls.length + newImages.length < 5 && (
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
          </div>
        ) : (
          <>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg">
                {content}
              </p>
            </div>
            {imageUrls && imageUrls.length > 0 && (
              <PostImageGallery 
                images={imageUrls} 
                alt={title} 
              />
            )}
          </>
        )}
      </div>

      <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        {isEditing ? (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={handleUpdate}
              className="min-w-[120px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setIsEditing(true)}
            >
              Edit Post
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500 font-medium text-center bg-red-50 dark:bg-red-950/20 py-2 rounded-lg">{error}</p>
      )}
    </>
  );
}
