// Token storage keys
export const TOKEN_STORAGE_KEY = 'auth_token';
export const USER_STORAGE_KEY = 'auth_user';

// File upload constants
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// API Polling
export const LIVE_CONTENT_POLL_INTERVAL = 5000; // 5 seconds

// Content Status
export const CONTENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// User Roles
export const USER_ROLES = {
  TEACHER: 'teacher',
  PRINCIPAL: 'principal',
  STUDENT: 'student',
} as const;

// Subject options (can be extended)
export const SUBJECT_OPTIONS = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Physical Education',
  'Art',
  'Music',
  'Computer Science',
  'Social Studies',
];

// Time format utilities
export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY';
export const DISPLAY_TIME_FORMAT = 'HH:mm A';
