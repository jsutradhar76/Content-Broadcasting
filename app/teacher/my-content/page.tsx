'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { ContentCard } from '@/components/shared/ContentCard';
import { useContentData } from '@/hooks/useContentData';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { AlertCircle, Upload, Trash2 } from 'lucide-react';
import { ContentStatus } from '@/types';

export default function MyContentPage() {
  const { content, isLoading, error, fetchContent, deleteContent } = useContentData(true);
  const [filter, setFilter] = useState<ContentStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchContent({ status: filter, search });
  }, [filter, search, fetchContent]);

  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    setDeleting(contentId);
    try {
      await deleteContent(contentId);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <ProtectedRoute requiredRole="teacher">
      <DashboardLayout>
        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">My Content</h1>
              <p className="text-muted-foreground">
                Manage and track your uploaded content
              </p>
            </div>
            <Link href="/teacher/upload">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload New
              </Button>
            </Link>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:flex-1"
              disabled={isLoading}
            />
            <Select
              value={filter}
              onValueChange={(value: any) => setFilter(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : content && content.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.data.map((item) => (
                <div key={item.id} className="relative group">
                  <ContentCard content={item} />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                  >
                    {deleting === item.id ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No content uploaded yet
              </p>
              <Link href="/teacher/upload">
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Content
                </Button>
              </Link>
            </div>
          )}

          {/* Pagination Info */}
          {content && (
            <div className="text-sm text-muted-foreground text-center">
              Showing {content.data.length} of {content.total} items
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
