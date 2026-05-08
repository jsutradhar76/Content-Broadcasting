'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { ContentTable } from '@/components/principal/ContentTable';
import { ApprovalModal } from '@/components/principal/ApprovalModal';
import { useContentData } from '@/hooks/useContentData';
import { approvalService } from '@/services/approval.service';
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
import { AlertCircle, ClipboardList } from 'lucide-react';
import { ContentStatus } from '@/types';

interface ModalState {
  isOpen: boolean;
  type: 'approve' | 'reject';
  contentId: string | null;
}

export default function AllContentPage() {
  const [filter, setFilter] = useState<ContentStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'approve',
    contentId: null,
  });
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const { content, isLoading, error, fetchContent } = useContentData(false);

  useEffect(() => {
    fetchContent({ status: filter, search });
  }, [filter, search, fetchContent]);

  const handleApproveClick = (contentId: string) => {
    setModal({
      isOpen: true,
      type: 'approve',
      contentId,
    });
    setApprovalError(null);
  };

  const handleRejectClick = (contentId: string) => {
    setModal({
      isOpen: true,
      type: 'reject',
      contentId,
    });
    setApprovalError(null);
  };

  const handleApprovalSubmit = async (
    contentId: string,
    rejectionReason?: string
  ) => {
    setIsApproving(true);
    setApprovalError(null);

    try {
      if (modal.type === 'approve') {
        await approvalService.approveContent(contentId);
      } else {
        if (!rejectionReason) {
          throw new Error('Rejection reason is required');
        }
        await approvalService.rejectContent(contentId, rejectionReason);
      }

      // Refresh content
      await fetchContent({ status: filter, search });
      setModal({ isOpen: false, type: 'approve', contentId: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process approval';
      setApprovalError(message);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="principal">
      <DashboardLayout>
        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">All Content</h1>
              <p className="text-muted-foreground">
                Browse and manage all uploaded content
              </p>
            </div>
            <Link href="/principal/approvals">
              <Button>
                <ClipboardList className="mr-2 h-4 w-4" />
                Pending Approvals
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
              placeholder="Search by title or teacher..."
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

          {/* Content Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : content && content.data.length > 0 ? (
            <div className="space-y-4">
              <ContentTable
                content={content.data}
                onApprove={handleApproveClick}
                onReject={handleRejectClick}
                isLoading={isApproving}
              />
              <div className="text-sm text-muted-foreground text-center">
                Showing {content.data.length} of {content.total} items
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No content found
              </p>
            </div>
          )}

          {/* Approval Modal */}
          <ApprovalModal
            contentId={modal.contentId || ''}
            isOpen={modal.isOpen}
            type={modal.type}
            error={approvalError || undefined}
            isLoading={isApproving}
            onClose={() =>
              setModal({ isOpen: false, type: 'approve', contentId: null })
            }
            onSubmit={handleApprovalSubmit}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
