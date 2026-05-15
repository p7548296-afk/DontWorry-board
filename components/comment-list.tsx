import { CommentOwnerActions } from "@/components/comment-owner-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Comment } from "@/types/comment";

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
}

export function CommentList({ comments, currentUserId }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-4">
        아직 댓글이 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const nickname = comment.profiles?.nickname || "익명";
        const date = new Date(comment.created_at).toLocaleDateString();
        const isOwner = currentUserId === comment.author_id;

        return (
          <Card
            key={comment.id}
            className="border-none shadow-none bg-muted/30"
          >
            <CardHeader className="py-3">
              <CardDescription>
                <span className="font-semibold text-foreground">
                  {nickname}
                </span>{" "}
                • {date}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-3 pt-0">
              {isOwner ? (
                <CommentOwnerActions
                  commentId={comment.id}
                  initialContent={comment.content}
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
