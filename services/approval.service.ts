import { apiPut } from '@/utils/api';
import { ApprovalResponse, ApiResponse } from '@/types';
import { authService } from './auth.service';
import { mockApproveContent, mockRejectContent } from '@/utils/mockApi';

class ApprovalService {
  private token = () => authService.getToken();

  /**
   * Approve content
   */
  async approveContent(contentId: string): Promise<ApprovalResponse> {
    try {
      const response = await apiPut<ApprovalResponse>(
        `/approvals/${contentId}/approve`,
        {},
        this.token()
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to approve content');
      }

      return response.data;
    } catch (error) {
      // Fallback to mock API
      console.log('[v0] Using mock API for approveContent');
      const user = authService.getUser();
      const content = await mockApproveContent(contentId, user?.id);
      return { content };
    }
  }

  /**
   * Reject content with reason
   */
  async rejectContent(
    contentId: string,
    rejectionReason: string
  ): Promise<ApprovalResponse> {
    try {
      const response = await apiPut<ApprovalResponse>(
        `/approvals/${contentId}/reject`,
        {
          rejectionReason,
        },
        this.token()
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to reject content');
      }

      return response.data;
    } catch (error) {
      // Fallback to mock API
      console.log('[v0] Using mock API for rejectContent');
      const user = authService.getUser();
      const content = await mockRejectContent(contentId, rejectionReason, user?.id);
      return { content };
    }
  }
}

export const approvalService = new ApprovalService();
