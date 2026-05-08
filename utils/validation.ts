import { z } from 'zod';

// Auth Validation Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Content Upload Validation
export const uploadContentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  subject: z
    .string()
    .min(1, 'Subject is required'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  startTime: z
    .string()
    .min(1, 'Start time is required'),
  endTime: z
    .string()
    .min(1, 'End time is required'),
  rotationDuration: z
    .number()
    .min(1, 'Rotation duration must be at least 1 second')
    .optional(),
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      'File size must be less than 10MB'
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
      'Only JPG, PNG, and GIF files are allowed'
    ),
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

export type UploadContentFormData = z.infer<typeof uploadContentSchema>;

// Approval Validation
export const rejectContentSchema = z.object({
  rejectionReason: z
    .string()
    .min(1, 'Rejection reason is required')
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason must be less than 500 characters'),
});

export type RejectContentFormData = z.infer<typeof rejectContentSchema>;

// Filter Validation
export const contentFilterSchema = z.object({
  status: z.enum(['all', 'pending', 'approved', 'rejected']).optional(),
  search: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).optional(),
});

export type ContentFilterData = z.infer<typeof contentFilterSchema>;
