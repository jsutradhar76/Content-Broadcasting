'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { UploadForm } from '@/components/teacher/UploadForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeacherUploadPage() {
  return (
    <ProtectedRoute requiredRole="teacher">
      <DashboardLayout>
        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Upload Content</h1>
            <p className="text-muted-foreground">
              Share educational content with your students
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <UploadForm />
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">File Types</p>
                    <p className="text-muted-foreground">JPG, PNG, or GIF images</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">File Size</p>
                    <p className="text-muted-foreground">Maximum 10MB per file</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Scheduling</p>
                    <p className="text-muted-foreground">
                      Set start and end times for when content is active
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Rotation</p>
                    <p className="text-muted-foreground">
                      Optional: set how long each image displays (in seconds)
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="font-medium mb-2">What happens next?</p>
                    <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
                      <li>Your content is uploaded</li>
                      <li>Principal reviews it</li>
                      <li>Approved content goes live</li>
                      <li>Students can view it</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
