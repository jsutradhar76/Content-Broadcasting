'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rejectContentSchema, type RejectContentFormData } from '@/utils/validation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ApprovalModalProps {
  contentId: string;
  isOpen: boolean;
  type: 'approve' | 'reject';
  isLoading?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (contentId: string, rejectionReason?: string) => Promise<void>;
}

export function ApprovalModal({
  contentId,
  isOpen,
  type,
  isLoading = false,
  error,
  onClose,
  onSubmit,
}: ApprovalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RejectContentFormData>({
    resolver: zodResolver(rejectContentSchema),
    defaultValues: {
      rejectionReason: '',
    },
  });

  const handleSubmit = async (data?: RejectContentFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(contentId, data?.rejectionReason);
      form.reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (type === 'approve') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Content</DialogTitle>
            <DialogDescription>
              This content will be immediately available for live broadcasting
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to approve this content? Once approved, it will be available for broadcasting.
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Approving...
                  </>
                ) : (
                  'Approve Content'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Content</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this content. The teacher will be notified.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => handleSubmit(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rejection Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why you're rejecting this content..."
                      {...field}
                      disabled={isSubmitting}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Rejecting...
                  </>
                ) : (
                  'Reject Content'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
