import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const nickname = post.profiles?.nickname || "Anonymous";
  const date = new Date(post.created_at).toLocaleDateString();
  const thumbnail = post.image_urls && post.image_urls.length > 0 ? post.image_urls[0] : null;

  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden hover:bg-zinc-50 transition-colors cursor-pointer group">
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
          <CardTitle className="line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
          <CardDescription className="mt-2">
            {nickname} • {date}
          </CardDescription>
        </CardHeader>
      </div>
    </Card>
  );
}
