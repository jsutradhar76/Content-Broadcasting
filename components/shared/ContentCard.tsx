import { Content } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ContentCardProps {
  content: Content;
  showPreview?: boolean;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export function ContentCard({
  content,
  showPreview = true,
}: ContentCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {showPreview && content.fileUrl && (
        <div className="relative h-48 bg-muted overflow-hidden">
          <img
            src={content.fileUrl}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="pt-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold line-clamp-2">{content.title}</h3>
          <p className="text-sm text-muted-foreground">{content.subject}</p>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={statusColors[content.status]}
          >
            {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(content.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {content.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {content.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t">
          <div>
            <p className="font-medium text-foreground">Start</p>
            <p>{new Date(content.startTime).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">End</p>
            <p>{new Date(content.endTime).toLocaleString()}</p>
          </div>
        </div>

        {content.rejectionReason && (
          <div className="p-2 bg-red-50 rounded text-sm text-red-700 border border-red-200">
            <p className="font-medium">Rejection Reason:</p>
            <p>{content.rejectionReason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
