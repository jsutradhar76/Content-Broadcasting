'use client';

import { useState, useCallback } from 'react';
import { Content, ContentFilter, PaginatedResponse, ContentStats } from '@/types';
import { contentService } from '@/services/content.service';

interface UseContentDataReturn {
  content: PaginatedResponse<Content> | null;
  stats: ContentStats | null;
  isLoading: boolean;
  error: string | null;
  fetchContent: (filter?: ContentFilter) => Promise<void>;
  fetchStats: () => Promise<void>;
  deleteContent: (contentId: string) => Promise<void>;
}

export function useContentData(isMyContent: boolean = false): UseContentDataReturn {
  const [content, setContent] = useState<PaginatedResponse<Content> | null>(null);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(
    async (filter?: ContentFilter) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = isMyContent
          ? await contentService.getMyContent(filter)
          : await contentService.getAllContent(filter);
        setContent(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch content';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [isMyContent]
  );

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contentService.getContentStats();
      setStats(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteContent = useCallback(async (contentId: string) => {
    setError(null);
    try {
      await contentService.deleteContent(contentId);
      // Refetch content after deletion
      if (content) {
        const updatedContent = {
          ...content,
          data: content.data.filter((item) => item.id !== contentId),
          total: content.total - 1,
        };
        setContent(updatedContent);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete content';
      setError(message);
      throw err;
    }
  }, [content]);

  return {
    content,
    stats,
    isLoading,
    error,
    fetchContent,
    fetchStats,
    deleteContent,
  };
}
