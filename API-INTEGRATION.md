# API Integration Guide

This document describes all API endpoints the frontend expects and their request/response formats.

## Base Configuration

```
Base URL: http://localhost:3001/api (configurable via NEXT_PUBLIC_API_URL)
Authentication: Bearer token in Authorization header
Content-Type: application/json (except file uploads)
```

## Authentication Endpoints

### POST /auth/login

Login user with email and password.

**Request:**
```json
{
  "email": "teacher@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "teacher@example.com",
    "name": "John Teacher",
    "role": "teacher"
  }
}
```

**Errors:**
- `401 Unauthorized`: Invalid email or password
- `400 Bad Request`: Missing email or password fields

---

## Content Endpoints

### GET /content/stats

Get content statistics for the current user.

**Authentication:** Required (Bearer token)

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "total": 15,
  "pending": 3,
  "approved": 10,
  "rejected": 2
}
```

---

### GET /content/my-content

Get content uploaded by the current teacher.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `status`: Filter by status (pending, approved, rejected) - Optional
- `search`: Search by title - Optional
- `page`: Page number (1-indexed) - Optional, default: 1
- `limit`: Items per page - Optional, default: 10

**Example:**
```
GET /content/my-content?status=pending&search=math&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "content-123",
      "teacherId": "user-456",
      "teacherName": "John Teacher",
      "title": "Introduction to Calculus",
      "subject": "Mathematics",
      "description": "Basic calculus concepts",
      "fileUrl": "https://...",
      "fileName": "calculus.jpg",
      "startTime": "2024-05-10T09:00:00Z",
      "endTime": "2024-05-10T10:00:00Z",
      "rotationDuration": 30,
      "status": "approved",
      "createdAt": "2024-05-08T14:30:00Z",
      "updatedAt": "2024-05-09T10:15:00Z",
      "rejectionReason": null
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

---

### GET /content

Get all content (for principals to review).

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `status`: Filter by status (pending, approved, rejected) - Optional
- `search`: Search by title or teacher name - Optional
- `page`: Page number (1-indexed) - Optional, default: 1
- `limit`: Items per page - Optional, default: 10

**Response:** Same format as `/content/my-content`

---

### GET /content/pending

Get all pending content awaiting approval.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `limit`: Max items to return - Optional, default: 10

**Response (200 OK):**
```json
[
  {
    "id": "content-123",
    "teacherId": "user-456",
    "teacherName": "Jane Doe",
    "title": "Science Experiment",
    "subject": "Science",
    "description": "Fun science demo",
    "fileUrl": "https://...",
    "fileName": "experiment.jpg",
    "startTime": "2024-05-11T09:00:00Z",
    "endTime": "2024-05-11T10:00:00Z",
    "rotationDuration": 45,
    "status": "pending",
    "createdAt": "2024-05-10T14:30:00Z",
    "updatedAt": "2024-05-10T14:30:00Z",
    "rejectionReason": null
  }
]
```

---

### POST /content/upload

Upload new content (multipart form data).

**Authentication:** Required (Bearer token)

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**Form Fields:**
- `title` (string, required): Content title
- `subject` (string, required): Subject name
- `description` (string, optional): Content description
- `file` (file, required): Image file (JPG, PNG, GIF)
- `startTime` (string, required): ISO 8601 datetime
- `endTime` (string, required): ISO 8601 datetime
- `rotationDuration` (number, optional): Duration in seconds

**Example:**
```bash
curl -X POST http://localhost:3001/api/content/upload \
  -H "Authorization: Bearer token..." \
  -F "title=Math Lesson" \
  -F "subject=Mathematics" \
  -F "description=Basic algebra" \
  -F "file=@image.jpg" \
  -F "startTime=2024-05-12T09:00:00Z" \
  -F "endTime=2024-05-12T10:00:00Z" \
  -F "rotationDuration=30"
```

**Response (201 Created):**
```json
{
  "id": "content-789",
  "teacherId": "user-123",
  "teacherName": "John Teacher",
  "title": "Math Lesson",
  "subject": "Mathematics",
  "description": "Basic algebra",
  "fileUrl": "https://cdn.example.com/content/content-789.jpg",
  "fileName": "image.jpg",
  "startTime": "2024-05-12T09:00:00Z",
  "endTime": "2024-05-12T10:00:00Z",
  "rotationDuration": 30,
  "status": "pending",
  "createdAt": "2024-05-11T15:20:00Z",
  "updatedAt": "2024-05-11T15:20:00Z",
  "rejectionReason": null
}
```

**Errors:**
- `400 Bad Request`: Invalid form data, file too large, wrong file type
- `413 Payload Too Large`: File exceeds size limit
- `422 Unprocessable Entity`: Validation error in fields

---

### GET /content/:id

Get specific content by ID.

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `id`: Content ID

**Response (200 OK):**
```json
{
  "id": "content-123",
  "teacherId": "user-456",
  "teacherName": "Jane Doe",
  "title": "Science Experiment",
  "subject": "Science",
  "description": "Fun science demo",
  "fileUrl": "https://...",
  "fileName": "experiment.jpg",
  "startTime": "2024-05-11T09:00:00Z",
  "endTime": "2024-05-11T10:00:00Z",
  "rotationDuration": 45,
  "status": "pending",
  "createdAt": "2024-05-10T14:30:00Z",
  "updatedAt": "2024-05-10T14:30:00Z",
  "rejectionReason": null
}
```

**Errors:**
- `404 Not Found`: Content doesn't exist

---

### DELETE /content/:id

Delete content (teacher can only delete their own).

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `id`: Content ID

**Response (204 No Content):** Empty response on success

**Errors:**
- `404 Not Found`: Content doesn't exist
- `403 Forbidden`: User cannot delete this content

---

### GET /content/teacher/:teacherId/active

Get currently active content for a teacher (no auth required).

**Authentication:** Not required

**Path Parameters:**
- `teacherId`: Teacher's user ID

**Response (200 OK):**
```json
{
  "id": "content-123",
  "teacherId": "user-456",
  "teacherName": "Jane Doe",
  "title": "Science Experiment",
  "subject": "Science",
  "description": "Fun science demo",
  "fileUrl": "https://...",
  "fileName": "experiment.jpg",
  "startTime": "2024-05-11T09:00:00Z",
  "endTime": "2024-05-11T10:00:00Z",
  "rotationDuration": 45,
  "status": "approved",
  "createdAt": "2024-05-10T14:30:00Z",
  "updatedAt": "2024-05-10T15:00:00Z",
  "rejectionReason": null
}
```

**Response (204 No Content):** If no active content

**Notes:**
- Should only return content with `status: "approved"`
- Should only return content where current time is between startTime and endTime
- Public endpoint, no authentication required

---

## Approval Endpoints

### PUT /approvals/:id/approve

Approve content (principal only).

**Authentication:** Required (Bearer token, must be principal)

**Path Parameters:**
- `id`: Content ID

**Request Body:** Empty or `{}`

**Response (200 OK):**
```json
{
  "id": "approval-456",
  "contentId": "content-123",
  "status": "approved",
  "rejectionReason": null,
  "approvedAt": "2024-05-11T10:30:00Z"
}
```

**Errors:**
- `404 Not Found`: Content doesn't exist
- `403 Forbidden`: User is not a principal
- `409 Conflict`: Content already approved/rejected

---

### PUT /approvals/:id/reject

Reject content with reason (principal only).

**Authentication:** Required (Bearer token, must be principal)

**Path Parameters:**
- `id`: Content ID

**Request Body:**
```json
{
  "rejectionReason": "Image quality is too low. Please upload a higher resolution image."
}
```

**Response (200 OK):**
```json
{
  "id": "approval-456",
  "contentId": "content-123",
  "status": "rejected",
  "rejectionReason": "Image quality is too low. Please upload a higher resolution image.",
  "approvedAt": null
}
```

**Errors:**
- `404 Not Found`: Content doesn't exist
- `403 Forbidden`: User is not a principal
- `400 Bad Request`: rejectionReason missing or too short
- `409 Conflict`: Content already approved/rejected

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "message": "Detailed error message (optional)",
  "code": "ERROR_CODE (optional)"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - User lacks permission |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Invalid state transition |
| 413 | Payload Too Large - File too big |
| 422 | Unprocessable Entity - Validation error |
| 500 | Server Error - Backend error |

---

## Data Types & Validation Rules

### User Object
```typescript
{
  id: string;           // Unique identifier
  email: string;        // Valid email format
  name: string;         // User's full name
  role: 'teacher' | 'principal' | 'student';  // User role
}
```

### Content Object
```typescript
{
  id: string;           // Unique identifier
  teacherId: string;    // Teacher's user ID
  teacherName: string;  // Teacher's full name
  title: string;        // 3-100 characters
  subject: string;      // From predefined list
  description?: string; // 0-500 characters
  fileUrl: string;      // URL to uploaded file
  fileName: string;     // Original filename
  startTime: string;    // ISO 8601 datetime
  endTime: string;      // ISO 8601 datetime (must be > startTime)
  rotationDuration?: number;  // Seconds (positive)
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;    // ISO 8601 datetime
  updatedAt: string;    // ISO 8601 datetime
  rejectionReason?: string;  // Only if rejected
}
```

### Pagination Object
```typescript
{
  data: T[];           // Array of items
  total: number;       // Total items in database
  page: number;        // Current page (1-indexed)
  limit: number;       // Items per page
  totalPages: number;  // Total number of pages
}
```

---

## Authentication

### Token Format
- JWT tokens expected
- Sent in `Authorization: Bearer {token}` header
- Should be valid for reasonable duration (24h+ recommended)

### Token Validation
- Invalid/expired tokens: Return `401 Unauthorized`
- Missing Authorization header: Return `401 Unauthorized`

---

## Rate Limiting (Optional)

Recommended for production:
- Implement rate limiting per user
- Return `429 Too Many Requests` when limit exceeded

---

## CORS Configuration

Required for frontend to access API:
```
Access-Control-Allow-Origin: http://localhost:3000 (or your domain)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Testing the API

### Using cURL

```bash
# Login
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"password123"}' \
  | jq -r '.token')

# Get content stats
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/content/stats

# Upload content
curl -X POST http://localhost:3001/api/content/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Test" \
  -F "subject=Mathematics" \
  -F "file=@image.jpg" \
  -F "startTime=2024-05-12T09:00:00Z" \
  -F "endTime=2024-05-12T10:00:00Z"
```

### Using Postman

1. Set base URL: `http://localhost:3001/api`
2. Use pre-request script to get and store token
3. Add Authorization header with bearer token
4. Create requests for each endpoint

---

## Implementation Checklist

- [ ] All endpoints implemented
- [ ] Proper error handling with correct status codes
- [ ] Token-based authentication working
- [ ] Role-based authorization enforced
- [ ] File upload working (max 10MB, JPG/PNG/GIF only)
- [ ] Pagination working correctly
- [ ] CORS configured for frontend URL
- [ ] Data validation on all inputs
- [ ] Timestamps in ISO 8601 format (UTC)
- [ ] Tested with frontend application

---

## Support

For issues or questions about the API contract, refer to FRONTEND-NOTES.md or the main README.md.
