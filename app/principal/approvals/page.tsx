'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { ContentCard } from '@/components/shared/ContentCard';
import { ApprovalModal } from '@/components/principal/ApprovalModal';
import { useContentData } from '@/hooks/useContentData';
import { approvalService } from '@/services/approval.service';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

interface ModalState {
  isOpen: boolean;
  type: 'approve' | 'reject';
  contentId: string | null;
}

export default function ApprovalsPage() {
  const { content, isLoading, error, fetchContent } = useContentData(false);
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'approve',
    contentId: null,
  });
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    fetchContent({ status: 'pending' });
  }, [fetchContent]);

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
      await fetchContent({ status: 'pending' });
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
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Pending Approvals</h1>
            <p className="text-muted-foreground">
              Review and approve content from teachers
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Content Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : content && content.data.length > 0 ? (
            <div className="space-y-6">
              <div className="text-sm text-muted-foreground">
                {content.data.length} pending approval
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.data.map((item) => (
                  <div key={item.id} className="space-y-4">
                    <ContentCard content={item} />

                    {/* Teacher Info */}
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Teacher:</span> {item.teacherName}
                      </p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Description:</span>{' '}
                          {item.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Submitted{' '}
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproveClick(item.id)}
                        className="flex-1 text-green-600 hover:text-green-700"
                        variant="outline"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectClick(item.id)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4 text-lg">
                All content has been reviewed!
              </p>
              <p className="text-sm text-muted-foreground">
                There are no pending approvals at this time.
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
