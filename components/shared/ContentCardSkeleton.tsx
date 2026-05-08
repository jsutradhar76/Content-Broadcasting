import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ContentCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="pt-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>

        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
