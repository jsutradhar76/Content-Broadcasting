'use client';

import { Content, ContentStatus } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContentTableProps {
  content: Content[];
  onApprove: (contentId: string) => void;
  onReject: (contentId: string) => void;
  isLoading?: boolean;
}

const statusColors: Record<ContentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export function ContentTable({
  content,
  onApprove,
  onReject,
  isLoading = false,
}: ContentTableProps) {
  if (content.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No content found
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="max-w-xs truncate font-medium">
                  {item.title}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {item.subject}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {item.teacherName}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={statusColors[item.status]}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(item.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {item.status === 'pending' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onApprove(item.id)}
                        disabled={isLoading}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Approve"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReject(item.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
