# Content Broadcasting System - Frontend Documentation

## Project Overview

This is a comprehensive React/Next.js application for managing educational content with role-based access control. Teachers upload content, principals approve or reject it, and students/public can view live broadcast content.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Forms**: React Hook Form + Zod for validation
- **State Management**: React Context API
- **HTTP Client**: Native fetch API with service layer abstraction
- **Language**: TypeScript
- **Date Handling**: date-fns for date formatting and utilities

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Landing page (redirects based on role)
│   ├── layout.tsx               # Root layout with AuthProvider
│   ├── auth/
│   │   └── page.tsx             # Login page
│   ├── teacher/
│   │   ├── dashboard/           # Teacher overview
│   │   ├── upload/              # Content upload form
│   │   └── my-content/          # Teacher's uploaded content
│   ├── principal/
│   │   ├── dashboard/           # Principal overview
│   │   ├── approvals/           # Pending approvals
│   │   └── all-content/         # All content management
│   └── live/
│       └── [teacherId]/         # Public live page (no auth required)
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx        # Login form with validation
│   │   └── ProtectedRoute.tsx   # Protected route wrapper
│   ├── teacher/
│   │   └── UploadForm.tsx       # Content upload form with file handling
│   ├── principal/
│   │   ├── ApprovalModal.tsx    # Modal for approve/reject
│   │   └── ContentTable.tsx     # Content table with actions
│   ├── shared/
│   │   ├── Navbar.tsx           # Top navigation bar
│   │   ├── Sidebar.tsx          # Role-based sidebar navigation
│   │   ├── DashboardLayout.tsx  # Layout wrapper for protected pages
│   │   ├── StatCard.tsx         # Statistics card component
│   │   ├── ContentCard.tsx      # Content preview card
│   │   ├── ContentCardSkeleton.tsx  # Loading skeleton
│   │   └── EmptyState.tsx       # Empty state placeholder
│   ├── live/
│   │   └── LiveContentViewer.tsx # Live content display with polling
│   └── ui/                       # shadcn/ui components
│
├── context/
│   └── AuthContext.tsx           # Global authentication state
│
├── hooks/
│   ├── useContentData.ts        # Hook for content CRUD operations
│   └── useFileUpload.ts         # Hook for file upload handling
│
├── services/
│   ├── auth.service.ts          # Authentication service
│   ├── content.service.ts       # Content management service
│   └── approval.service.ts      # Content approval service
│
├── types/
│   └── index.ts                 # TypeScript interfaces and types
│
├── utils/
│   ├── api.ts                   # API client with helpers
│   ├── validation.ts            # Zod schemas for forms
│   └── constants.ts             # Application constants
│
└── lib/
    └── utils.ts                 # Utility functions (cn helper)
```

## Architecture Highlights

### Authentication Flow

1. User enters credentials on `/auth` page
2. LoginForm validates and calls `authService.login()`
3. Service makes API call to `/api/auth/login`
4. On success: token and user stored in localStorage
5. AuthContext provides auth state globally
6. Protected pages use `ProtectedRoute` component to restrict access
7. Invalid/expired tokens redirect user to `/auth`

### Service Layer Design

All API calls go through dedicated service classes:
- **auth.service.ts**: Login/logout, token management
- **content.service.ts**: Content CRUD, filtering, stats
- **approval.service.ts**: Content approval workflows

This design ensures:
- Easy to replace API calls (mock for testing)
- Centralized error handling
- Token automatically attached to requests
- Single source of truth for API logic

### State Management

- **Global**: AuthContext for user and token
- **Component-level**: React Hook Form for forms, useState for UI state
- **Data Fetching**: Custom hooks (useContentData, useFileUpload)

No Redux/Zustand needed due to simple state requirements.

### Form Validation

All forms use React Hook Form + Zod:
- Client-side validation before submission
- Type-safe schema inference
- Custom error messages
- Real-time validation feedback

Example:
```typescript
const schema = z.object({
  title: z.string().min(3),
  file: z.instanceof(File).refine(f => f.size < 10MB)
});
```

### File Upload Handling

1. User selects file, preview displayed
2. `useFileUpload` validates file type and size
3. FormData sent to `/api/content/upload`
4. Progress tracked and displayed
5. On success, redirects to content list

## Key Components

### ProtectedRoute
Wraps pages to require authentication and specific roles:
```typescript
<ProtectedRoute requiredRole="teacher">
  <TeacherPage />
</ProtectedRoute>
```

### DashboardLayout
Provides consistent layout with navbar and sidebar:
```typescript
<DashboardLayout>
  {/* Page content */}
</DashboardLayout>
```

### ContentCard
Reusable card displaying content preview:
```typescript
<ContentCard content={contentItem} showPreview={true} />
```

### ApprovalModal
Modal for approve/reject with optional rejection reason field.

## API Integration

### Base Configuration
- Base URL: `process.env.NEXT_PUBLIC_API_URL` (defaults to localhost:3001/api)
- Token: Automatically attached to Authorization header
- Content-Type: application/json (except file uploads)

### API Endpoints Used

```
POST   /auth/login                    - User login
GET    /content/stats                 - Get content statistics
GET    /content/my-content            - Teacher's content
GET    /content                       - All content (with filters)
GET    /content/pending               - Pending approvals
POST   /content/upload                - Upload new content
GET    /content/:id                   - Get specific content
DELETE /content/:id                   - Delete content
GET    /content/teacher/:id/active    - Get active content for teacher
PUT    /approvals/:id/approve         - Approve content
PUT    /approvals/:id/reject          - Reject content
```

### Error Handling

- API errors caught and displayed in UI
- User-friendly error messages
- Failed requests don't break application
- Automatic logout on 401 (unauthorized)

## Role-Based Routing

### Teacher (`/teacher/*`)
- **Dashboard**: View statistics and quick actions
- **Upload**: Upload new content with scheduling
- **My Content**: Manage own uploaded content with filtering
- Can view live page: `/live/[teacherId]`

### Principal (`/principal/*`)
- **Dashboard**: Overview of all content and statistics
- **Approvals**: Review pending content
- **All Content**: Browse all content with status filters
- Can approve or reject content
- Can view teacher's live page

### Public (`/live/[teacherId]`)
- No authentication required
- View currently active content for a teacher
- Auto-refreshes every 5 seconds
- Shows title, subject, description, image preview

## Form Validation Schemas

All Zod schemas in `utils/validation.ts`:

1. **loginSchema**: Email and password validation
2. **uploadContentSchema**: Content upload with file validation
3. **rejectContentSchema**: Rejection reason validation
4. **contentFilterSchema**: Filter parameters validation

## Constants

Key constants in `utils/constants.ts`:

- `ALLOWED_FILE_TYPES`: JPG, PNG, GIF
- `MAX_FILE_SIZE`: 10MB
- `DEFAULT_PAGE_SIZE`: 10 items per page
- `LIVE_CONTENT_POLL_INTERVAL`: 5 seconds
- `SUBJECT_OPTIONS`: Predefined list of subjects
- `CONTENT_STATUS`: pending, approved, rejected
- `USER_ROLES`: teacher, principal, student

## Authentication & Security

### Token Storage
- Stored in localStorage after login
- Sent in Authorization header: `Bearer <token>`
- Cleared on logout
- No sensitive data in token payload stored client-side

### Protected Routes
- `ProtectedRoute` component checks authentication
- Unauthenticated users redirected to `/auth`
- Role mismatch redirects to `/` (landing page)

### Input Validation
- All forms validated with Zod
- File uploads validated for type and size
- Email format validation
- Required field validation

## Performance Optimizations

1. **Code Splitting**: Next.js automatic page splitting
2. **Memoization**: Components memoized where needed
3. **Image Optimization**: Using native Next.js image handling
4. **Lazy Loading**: Pages loaded on-demand via App Router
5. **Efficient Re-renders**: Context only updates when auth changes

## Debugging

### Common Issues

**1. API calls failing**
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify backend is running on correct port
- Check browser console for CORS errors

**2. Login not working**
- Verify credentials match backend
- Check token is stored in localStorage
- Check network tab in DevTools for API response

**3. Files not uploading**
- Check file size (max 10MB)
- Check file type (JPG, PNG, GIF only)
- Verify `/api/content/upload` endpoint exists

**4. Content not displaying**
- Check user has approve status
- Verify start/end times are correct
- Check teacherId in URL matches actual teacher

### Testing Credentials

Use these demo accounts for testing:

```
Teacher:
  Email: teacher@example.com
  Password: password

Principal:
  Email: principal@example.com
  Password: password
```

## Environment Variables

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Optional: Analytics, etc.
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with `vercel deploy`

### Build Command
```bash
npm run build  # or pnpm build, yarn build
```

### Start Production Server
```bash
npm run start  # or pnpm start
```

## Assumptions

1. Backend API returns tokens in JWT format
2. Token decoded on client doesn't contain sensitive data
3. Backend implements role-based access control
4. File uploads return file URLs for preview
5. Times stored as ISO 8601 strings in UTC
6. Emails are unique per user
7. Teachers/Principals identified by `role` field in user object
8. Active content determined by comparing current time with start/end times

## Future Enhancements

1. **React Query**: Replace custom hooks with React Query for better caching
2. **Dark Mode**: Add dark mode toggle
3. **Pagination**: Implement proper pagination for large datasets
4. **Search**: Enhanced search with filters
5. **Notifications**: Real-time notifications for approvals
6. **Analytics**: User activity tracking
7. **Testing**: Unit and integration tests
8. **Accessibility**: Enhanced ARIA labels and keyboard navigation

## Support & Troubleshooting

For issues:
1. Check browser console for error messages
2. Verify API is running and accessible
3. Check environment variables are set correctly
4. Clear localStorage and try again
5. Check that backend implementation matches expected endpoints

## Code Style

- TypeScript for type safety
- Consistent naming conventions
- Components split into logical units
- Services handle all business logic
- Hooks encapsulate state logic
- Utility functions for reusable logic

---

**Last Updated**: 2024
**Version**: 1.0.0
