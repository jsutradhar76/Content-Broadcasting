'use client';

import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { ContentCard } from '@/components/shared/ContentCard';
import { useContentData } from '@/hooks/useContentData';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { BarChart3, Clock, CheckCircle, AlertCircle, ClipboardList } from 'lucide-react';

export default function PrincipalDashboard() {
  const { stats, content, isLoading, error, fetchStats, fetchContent } = useContentData(false);

  useEffect(() => {
    fetchStats();
    fetchContent({ limit: 6 });
  }, [fetchStats, fetchContent]);

  return (
    <ProtectedRoute requiredRole="principal">
      <DashboardLayout>
        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of all content and approvals
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  label="Total Content"
                  value={stats.total}
                  icon={BarChart3}
                  description="All uploaded"
                />
                <StatCard
                  label="Pending"
                  value={stats.pending}
                  icon={Clock}
                  description="Needs review"
                />
                <StatCard
                  label="Approved"
                  value={stats.approved}
                  icon={CheckCircle}
                  description="Ready to broadcast"
                />
                <StatCard
                  label="Rejected"
                  value={stats.rejected}
                  icon={AlertCircle}
                  description="Revisions needed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap">
                <Link href="/principal/approvals" className="w-full md:w-auto">
                  <Button className="w-full">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Review Pending ({stats.pending})
                  </Button>
                </Link>
                <Link href="/principal/all-content" className="w-full md:w-auto">
                  <Button variant="outline" className="w-full">
                    View All Content
                  </Button>
                </Link>
              </div>

              {/* Recent Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent Content</h2>
                  <Link href="/principal/all-content">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>

                {content && content.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {content.data.slice(0, 3).map((item) => (
                      <ContentCard key={item.id} content={item} showPreview={false} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No content available yet
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/principal/approvals">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Pending Approvals
                  </Button>
                </Link>
                <Link href="/principal/all-content">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    All Content
                  </Button>
                </Link>
                <Link href="/principal/approvals">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Content Review
                  </Button>
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
