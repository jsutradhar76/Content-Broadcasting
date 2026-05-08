// User and Auth Types
export type UserRole = 'teacher' | 'principal' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Content Types
export type ContentStatus = 'pending' | 'approved' | 'rejected';

export interface Content {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  subject: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  rotationDuration?: number; // in seconds
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

export interface CreateContentRequest {
  title: string;
  subject: string;
  description?: string;
  file: File;
  startTime: string;
  endTime: string;
  rotationDuration?: number;
}

// Approval Types
export interface ApprovalRequest {
  contentId: string;
  action: 'approve' | 'reject';
  rejectionReason?: string;
}

export interface ApprovalResponse {
  id: string;
  contentId: string;
  status: ContentStatus;
  rejectionReason?: string;
  approvedAt?: string;
}

// Pagination and Filter Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ContentFilter {
  status?: ContentStatus | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Statistics Types
export interface ContentStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// Dashboard Types
export interface DashboardStats {
  contentStats: ContentStats;
  recentContent: Content[];
}
