'use client';

import { useEffect, useState } from 'react';
import { Content } from '@/types';
import { contentService } from '@/services/content.service';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { LIVE_CONTENT_POLL_INTERVAL } from '@/utils/constants';

interface LiveContentViewerProps {
  teacherId: string;
}

export function LiveContentViewer({ teacherId }: LiveContentViewerProps) {
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchActiveContent = async () => {
    setError(null);
    try {
      const data = await contentService.getActiveContent(teacherId);
      setContent(data);
      setLastUpdated(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch content';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchActiveContent();

    // Set up polling
    const interval = setInterval(() => {
      fetchActiveContent();
    }, LIVE_CONTENT_POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [teacherId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <Spinner className="h-8 w-8 mx-auto" />
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!content) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-4">
            <div className="text-5xl text-muted-foreground/30">📺</div>
            <p className="text-lg font-medium">No content available</p>
            <p className="text-sm text-muted-foreground">
              There is no active content scheduled at this time.
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-4">
                Last updated:{' '}
                {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="line-clamp-2">{content.title}</CardTitle>
            <CardDescription>
              {content.subject} • by {content.teacherName}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            Live
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content Image */}
        {content.fileUrl && (
          <div className="relative w-full bg-muted rounded-lg overflow-hidden aspect-video md:aspect-auto md:h-96">
            <img
              src={content.fileUrl}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-border">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Start Time</p>
            <p className="text-sm">
              {new Date(content.startTime).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">End Time</p>
            <p className="text-sm">
              {new Date(content.endTime).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Description */}
        {content.description && (
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {content.description}
            </p>
          </div>
        )}

        {/* Rotation Duration */}
        {content.rotationDuration && (
          <div className="pt-2 text-xs text-muted-foreground bg-muted p-3 rounded">
            This content rotates every {content.rotationDuration} seconds
          </div>
        )}

        {/* Auto-refresh Info */}
        <div className="pt-2 text-xs text-muted-foreground text-center">
          Updates automatically every {LIVE_CONTENT_POLL_INTERVAL / 1000} seconds
          {lastUpdated && (
            <>
              <br />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
