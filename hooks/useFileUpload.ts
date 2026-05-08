'use client';

import { useState, useCallback } from 'react';
import { Content, CreateContentRequest } from '@/types';
import { contentService } from '@/services/content.service';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/utils/constants';

interface UseFileUploadReturn {
  isUploading: boolean;
  error: string | null;
  progress: number;
  uploadContent: (data: CreateContentRequest) => Promise<Content>;
  validateFile: (file: File) => string | null;
  resetError: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const validateFile = useCallback((file: File): string | null => {
    if (!file) {
      return 'File is required';
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Only JPG, PNG, and GIF files are allowed';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }

    return null;
  }, []);

  const uploadContent = useCallback(
    async (data: CreateContentRequest): Promise<Content> => {
      // Validate file
      const fileError = validateFile(data.file);
      if (fileError) {
        setError(fileError);
        throw new Error(fileError);
      }

      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) return prev;
            return prev + Math.random() * 30;
          });
        }, 500);

        const result = await contentService.uploadContent(data);

        clearInterval(progressInterval);
        setProgress(100);

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [validateFile]
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isUploading,
    error,
    progress,
    uploadContent,
    validateFile,
    resetError,
  };
}
