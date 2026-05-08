'use client';

import { LiveContentViewer } from '@/components/live/LiveContentViewer';
import { use } from 'react';

interface LivePageProps {
  params: Promise<{
    teacherId: string;
  }>;
}

export default function LivePage({ params }: LivePageProps) {
  const { teacherId } = use(params);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Live Content Broadcasting</h1>
              <p className="text-sm text-muted-foreground">
                Real-time content from your teacher
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
              <div className="h-2 w-2 bg-red-600 dark:bg-red-400 rounded-full animate-pulse" />
              LIVE
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-6 py-8">
        <LiveContentViewer teacherId={teacherId} />

        {/* Info Section */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-semibold">ℹ️ About this page:</span> This page
            displays content that has been approved and is currently scheduled to be
            broadcast. Content updates automatically every few seconds. No login
            required.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-4">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>Content Broadcasting System © 2024</p>
        </div>
      </footer>
    </div>
  );
}
