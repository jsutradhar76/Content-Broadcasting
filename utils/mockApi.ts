// Mock API responses for development without a real backend
// This file simulates API calls for testing the frontend

import { User, Content, ApprovalRequest } from '@/types';

// Mock database
const mockDatabase = {
  users: [
    {
      id: '1',
      email: 'teacher@example.com',
      password: 'password', // In real app, this would be hashed
      name: 'John Teacher',
      role: 'teacher' as const,
    },
    {
      id: '2',
      email: 'principal@example.com',
      password: 'password',
      name: 'Jane Principal',
      role: 'principal' as const,
    },
  ],
  contents: [
    {
      id: '1',
      teacherId: '1',
      title: 'Introduction to Biology',
      description: 'Basic concepts of cell biology',
      imageUrl: 'https://images.unsplash.com/photo-1576762778284-92f466f1e024?w=500&h=300&fit=crop',
      status: 'approved' as const,
      createdAt: new Date('2024-01-15'),
      approvedAt: new Date('2024-01-16'),
      approvedBy: '2',
    },
    {
      id: '2',
      teacherId: '1',
      title: 'Photosynthesis Process',
      description: 'Understanding how plants convert sunlight to energy',
      imageUrl: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=500&h=300&fit=crop',
      status: 'pending' as const,
      createdAt: new Date('2024-01-20'),
    },
  ] as Content[],
  approvals: [] as ApprovalRequest[],
};

export const mockLogin = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  const user = mockDatabase.users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }

  const token = `mock-token-${user.id}-${Date.now()}`;

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  };
};

export const mockGetContents = async (
  filters?: {
    status?: string;
    teacherId?: string;
  }
): Promise<Content[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let contents = [...mockDatabase.contents];

  if (filters?.status) {
    contents = contents.filter((c) => c.status === filters.status);
  }

  if (filters?.teacherId) {
    contents = contents.filter((c) => c.teacherId === filters.teacherId);
  }

  return contents;
};

export const mockUploadContent = async (
  teacherId: string,
  data: {
    title: string;
    description: string;
    file: File;
  }
): Promise<Content> => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate upload

  const newContent: Content = {
    id: String(mockDatabase.contents.length + 1),
    teacherId,
    title: data.title,
    description: data.description,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f70504504?w=500&h=300&fit=crop',
    status: 'pending',
    createdAt: new Date(),
  };

  mockDatabase.contents.push(newContent);
  return newContent;
};

export const mockApproveContent = async (
  contentId: string,
  approvedBy: string
): Promise<Content> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const content = mockDatabase.contents.find((c) => c.id === contentId);
  if (!content) throw new Error('Content not found');

  content.status = 'approved';
  content.approvedAt = new Date();
  content.approvedBy = approvedBy;

  return content;
};

export const mockRejectContent = async (
  contentId: string,
  rejectionReason: string,
  rejectedBy: string
): Promise<Content> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const content = mockDatabase.contents.find((c) => c.id === contentId);
  if (!content) throw new Error('Content not found');

  content.status = 'rejected';
  content.rejectionReason = rejectionReason;
  content.rejectedAt = new Date();
  content.rejectedBy = rejectedBy;

  return content;
};

export const mockGetStats = async (userId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const userContents = mockDatabase.contents.filter((c) => c.teacherId === userId);
  const approvedCount = userContents.filter((c) => c.status === 'approved').length;
  const pendingCount = userContents.filter((c) => c.status === 'pending').length;
  const rejectedCount = userContents.filter((c) => c.status === 'rejected').length;

  return {
    total: userContents.length,
    approved: approvedCount,
    pending: pendingCount,
    rejected: rejectedCount,
  };
};

export const mockGetPrincipalStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    totalTeachers: 10,
    totalContent: mockDatabase.contents.length,
    pending: mockDatabase.contents.filter((c) => c.status === 'pending').length,
    approved: mockDatabase.contents.filter((c) => c.status === 'approved').length,
  };
};
