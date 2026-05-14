import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const preview = post.content.length > 100 
    ? post.content.substring(0, 100) + "..." 
    : post.content;

  const nickname = post.profiles?.nickname || "Anonymous";
  const date = new Date(post.created_at).toLocaleDateString();

  return (
    <Card className="hover:bg-zinc-50 transition-colors cursor-pointer">
      <CardHeader>
        <CardTitle className="line-clamp-1">{post.title}</CardTitle>
        <CardDescription>{nickname} • {date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">{preview}</p>
      </CardContent>
    </Card>
  );
}
