import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Post } from "@/types/post";
import { MessageCircle } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const nickname = post.profiles?.nickname || "Anonymous";
  const date = new Date(post.created_at).toLocaleDateString();
  const thumbnail = post.image_urls && post.image_urls.length > 0 ? post.image_urls[0] : null;
  const commentCount = post.comments?.length || 0;

  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer group border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      {thumbnail && (
        <div className="w-full sm:w-48 aspect-video sm:aspect-square flex-shrink-0 overflow-hidden border-b sm:border-b-0 sm:border-r border-zinc-100 dark:border-zinc-800">
          <img
            src={thumbnail}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <CardHeader className="h-full flex flex-col justify-center">
          <CardTitle className="line-clamp-2 leading-snug group-hover:text-primary transition-colors text-zinc-900 dark:text-zinc-50">
            {post.title}
          </CardTitle>
          <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span>{nickname} • {date}</span>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4 fill-current" />
              <span>{commentCount}</span>
            </div>
          </div>
        </CardHeader>
      </div>
    </Card>
  );
}
