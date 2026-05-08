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
import { BarChart3, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';

export default function TeacherDashboard() {
  const { stats, isLoading, error, fetchStats } = useContentData(true);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <ProtectedRoute requiredRole="teacher">
      <DashboardLayout>
        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s an overview of your content
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
                  description="All uploaded content"
                />
                <StatCard
                  label="Pending"
                  value={stats.pending}
                  icon={Clock}
                  description="Awaiting approval"
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
                  description="Needs revision"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap">
                <Link href="/teacher/upload" className="w-full md:w-auto">
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Content
                  </Button>
                </Link>
                <Link href="/teacher/my-content" className="w-full md:w-auto">
                  <Button variant="outline" className="w-full">
                    View All Content
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Content Overview</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>Pending Review</span>
                      <span className="font-bold text-lg">{stats.pending}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <span>Approved & Ready</span>
                      <span className="font-bold text-lg text-green-700 dark:text-green-300">
                        {stats.approved}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <span>Rejected (Revise)</span>
                      <span className="font-bold text-lg text-red-700 dark:text-red-300">
                        {stats.rejected}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Quick Actions</h2>
                  <div className="space-y-2">
                    <Link href="/teacher/upload" className="block">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Content
                      </Button>
                    </Link>
                    <Link href="/teacher/my-content" className="block">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View My Content
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
