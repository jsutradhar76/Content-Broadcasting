'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useFileUpload } from '@/hooks/useFileUpload';
import { uploadContentSchema, type UploadContentFormData } from '@/utils/validation';
import { SUBJECT_OPTIONS } from '@/utils/constants';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export function UploadForm() {
  const router = useRouter();
  const { uploadContent, isUploading, error, progress, resetError } = useFileUpload();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const form = useForm<UploadContentFormData>({
    resolver: zodResolver(uploadContentSchema),
    defaultValues: {
      title: '',
      subject: '',
      description: '',
      startTime: '',
      endTime: '',
      rotationDuration: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('file', file);

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: UploadContentFormData) {
    resetError();
    setUploadSuccess(false);

    try {
      await uploadContent(data);
      setUploadSuccess(true);

      // Reset form
      form.reset();
      setPreviewUrl('');

      // Redirect after success
      setTimeout(() => {
        router.push('/teacher/my-content');
      }, 2000);
    } catch (err) {
      // Error is handled in the hook
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Upload Content</CardTitle>
        <CardDescription>Share educational content with your students</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {uploadSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Content uploaded successfully! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Introduction to Calculus"
                      {...field}
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isUploading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUBJECT_OPTIONS.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the content..."
                      {...field}
                      disabled={isUploading}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>File Upload</FormLabel>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="space-y-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded mx-auto"
                    />
                    <p className="text-sm font-medium">{form.watch('file')?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG, or GIF (max 10MB)
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rotationDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rotation Duration (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 30"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value, 10) : undefined
                        )
                      }
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormDescription>
                    How long to display the content before moving to next
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                'Upload Content'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
