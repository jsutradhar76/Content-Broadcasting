import {
  apiGet,
  apiPost,
  apiDelete,
  apiUploadFile,
} from '@/utils/api';
import {
  Content,
  CreateContentRequest,
  ContentFilter,
  PaginatedResponse,
  ContentStats,
  ApiResponse,
} from '@/types';
import { authService } from './auth.service';
import {
  mockGetContents,
  mockUploadContent,
  mockGetStats,
  mockApproveContent,
} from '@/utils/mockApi';

class ContentService {
  private token = () => authService.getToken();

  /**
   * Get user's uploaded content (for teachers)
   */
  async getMyContent(filter?: ContentFilter): Promise<PaginatedResponse<Content>> {
    try {
      const params = new URLSearchParams();
      if (filter?.status && filter.status !== 'all') {
        params.append('status', filter.status);
      }
      if (filter?.search) {
        params.append('search', filter.search);
      }
      if (filter?.page) {
        params.append('page', filter.page.toString());
      }
      if (filter?.limit) {
        params.append('limit', filter.limit.toString());
      }

      const endpoint = `/content/my-content${params.toString() ? '?' + params : ''}`;
      const response = await apiGet<PaginatedResponse<Content>>(endpoint, this.token());

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch content');
      }

      return response.data;
    } catch (error) {
      // Fallback to mock API
      console.log('[v0] Using mock API for getMyContent');
      const user = authService.getUser();
      const contents = await mockGetContents({
        teacherId: user?.id,
        status: filter?.status && filter.status !== 'all' ? filter.status : undefined,
      });
      
      return {
        data: contents,
        pagination: {
          page: 1,
          limit: 10,
          total: contents.length,
          pages: 1,
        },
      };
    }
  }

  /**
   * Get all content with filtering (for principals)
   */
  async getAllContent(filter?: ContentFilter): Promise<PaginatedResponse<Content>> {
    try {
      const params = new URLSearchParams();
      if (filter?.status && filter.status !== 'all') {
        params.append('status', filter.status);
      }
      if (filter?.search) {
        params.append('search', filter.search);
      }
      if (filter?.page) {
        params.append('page', filter.page.toString());
      }
      if (filter?.limit) {
        params.append('limit', filter.limit.toString());
      }

      const endpoint = `/content${params.toString() ? '?' + params : ''}`;
      const response = await apiGet<PaginatedResponse<Content>>(endpoint, this.token());

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch content');
      }

      return response.data;
    } catch (error) {
      // Fallback to mock API
      console.log('[v0] Using mock API for getAllContent');
      const contents = await mockGetContents({
        status: filter?.status && filter.status !== 'all' ? filter.status : undefined,
      });

      return {
        data: contents,
        pagination: {
          page: 1,
          limit: 10,
          total: contents.length,
          pages: 1,
        },
      };
    }
  }

  /**
   * Get pending content for approval (for principals)
   */
  async getPendingContent(limit?: number): Promise<Content[]> {
    try {
      const endpoint = `/content/pending${limit ? `?limit=${limit}` : ''}`;
      const response = await apiGet<Content[]>(endpoint, this.token());

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch pending content');
      }

      return response.data;
    } catch (error) {
      // Fallback to mock API
      console.log('[v0] Using mock API for getPendingContent');
      const contents = await mockGetContents({ status: 'pending' });
      return limit ? contents.slice(0, limit) : contents;
    }
  }

  /**
   * Get content statistics
   */
  async getContentStats(): Promise<ContentStats> {
    try {
      const response = await apiGet<ContentStats>('/content/stats', this.token());

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch stats');
      }

      return response.data;
    } catch (error) {
      // Fallback to mock API
      console.log('[v0] Using mock API for getContentStats');
      const user = authService.getUser();
      return await mockGetStats(user?.id);
    }
  }

  /**
   * Get content by ID
   */
  async getContentById(contentId: string): Promise<Content> {
    const response = await apiGet<Content>(`/content/${contentId}`, this.token());

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch content');
    }

    return response.data;
  }

  /**
   * Get active content for a teacher (public live page)
   */
  async getActiveContent(teacherId: string): Promise<Content | null> {
    const response = await apiGet<Content | null>(`/content/teacher/${teacherId}/active`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch active content');
    }

    return response.data || null;
  }

  /**
   * Upload new content
   */
  async uploadContent(data: CreateContentRequest): Promise<Content> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subject', data.subject);
      if (data.description) {
        formData.append('description', data.description);
      }
      formData.append('file', data.file);
      formData.append('startTime', data.startTime);
      formData.append('endTime', data.endTime);
      if (data.rotationDuration) {
        formData.append('rotationDuration', data.rotationDuration.toString());
      }

      const response = await apiUploadFile<Content>(
        '/content/upload',
        formData,
        this.token()
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to upload content');
      }

      return response.data;
    } catch (error) {
      // Fallback to mock API
      console.log('[v0] Using mock API for uploadContent');
      const user = authService.getUser();
      return await mockUploadContent(user?.id, {
        title: data.title,
        description: data.description || '',
        file: data.file,
      });
    }
  }

  /**
   * Delete content (teacher can only delete their own content)
   */
  async deleteContent(contentId: string): Promise<void> {
    const response = await apiDelete(`/content/${contentId}`, this.token());

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete content');
    }
  }
}

export const contentService = new ContentService();
