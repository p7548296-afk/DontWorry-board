import { Card, CardTitle } from "@/components/ui/card";
import { Post } from "@/types/post";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

interface PostCardProps {
  post: Post;
  priority?: boolean;
}

export function PostCard({ post, priority = false }: PostCardProps) {
  const nickname = post.profiles?.nickname || "Anonymous";
  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const thumbnail = post.image_urls && post.image_urls.length > 0 ? post.image_urls[0] : null;
  const commentCount = post.comments?.length || 0;

  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-pointer group border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-0 ring-0 shadow-sm hover:shadow-md">
      {thumbnail && (
        <div className="w-full sm:w-44 aspect-video sm:aspect-square flex-shrink-0 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={thumbnail}
            alt={post.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, 176px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="flex-1 min-w-0 p-5 sm:p-6 flex flex-col justify-center">
        <div className="space-y-3">
          <CardTitle className="text-xl sm:text-xl font-bold line-clamp-2 leading-[1.4] group-hover:text-primary transition-colors text-zinc-900 dark:text-zinc-50">
            {post.title}
          </CardTitle>
          <div className="flex items-center gap-3 text-[13px] text-zinc-500 dark:text-zinc-400 font-medium">
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{nickname}</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span>{date}</span>
            <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="font-bold">{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
