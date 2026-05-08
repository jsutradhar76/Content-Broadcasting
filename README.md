# Content Broadcasting System - Frontend

A modern React/Next.js application for managing and broadcasting educational content with role-based access control. Teachers upload content, principals approve or reject it, and students view live broadcasts.

## Features

✨ **Core Features**
- Role-based authentication (Teacher, Principal, Student/Public)
- Content upload with validation (JPG, PNG, GIF, max 10MB)
- Content approval workflow with rejection reasons
- Live public broadcasting page with auto-refresh
- Responsive design for all devices
- Real-time statistics and dashboards

🔐 **Security**
- Token-based authentication
- Protected routes with role validation
- Input validation with Zod
- Secure API integration

📊 **User Experiences**
- Teacher: Upload, manage content, track approval status
- Principal: Review, approve, reject, filter all content
- Student/Public: View active content on public live page

## Tech Stack

- **Frontend**: React 19 with Next.js 16
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Language**: TypeScript
- **State**: React Context API
- **HTTP**: Native Fetch API

## Quick Start

### Prerequisites
- Node.js 18+ (or Bun/pnpm)
- Git

### Installation

```bash
# Clone or extract the project
cd content-broadcasting-frontend

# Install dependencies
pnpm install
# or: npm install / yarn install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URL
```

### Configuration

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development

```bash
# Start development server
pnpm dev

# Open browser
# Visit: http://localhost:3000
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Usage

### Teacher Workflow

1. **Login**: Navigate to `/auth`
   - Email: `teacher@example.com`
   - Password: `password`

2. **Upload Content**: Go to Teacher → Upload Content
   - Fill in title, subject, description
   - Select image file (JPG/PNG/GIF, <10MB)
   - Set start and end times
   - Set rotation duration (optional)
   - Click "Upload Content"

3. **Track Status**: View in Teacher → My Content
   - See approval status (Pending, Approved, Rejected)
   - View rejection reasons if applicable
   - Delete rejected content

### Principal Workflow

1. **Login**: Navigate to `/auth`
   - Email: `principal@example.com`
   - Password: `password`

2. **Review Pending**: Go to Principal → Pending Approvals
   - View content awaiting approval
   - Click "Approve" to broadcast
   - Click "Reject" and provide reason

3. **Manage All**: View Principal → All Content
   - Filter by status (All, Pending, Approved, Rejected)
   - Search by title or teacher
   - Quick approve/reject actions

### Student/Public Access

1. **View Live**: Visit `/live/[teacherId]`
   - No login required
   - See currently active content
   - Auto-refreshes every 5 seconds
   - Shows title, subject, description, image

## File Structure

```
src/
├── app/                    # Next.js pages
├── components/             # React components
├── context/               # State management
├── hooks/                 # Custom hooks
├── services/              # API integration
├── types/                 # TypeScript types
└── utils/                 # Utilities and constants
```

See `FRONTEND-NOTES.md` for detailed documentation.

## API Integration

The frontend expects these API endpoints:

```
Authentication
POST   /auth/login

Content Management
GET    /content/stats
GET    /content/my-content
GET    /content
GET    /content/pending
POST   /content/upload
GET    /content/:id
DELETE /content/:id
GET    /content/teacher/:id/active

Approvals
PUT    /approvals/:id/approve
PUT    /approvals/:id/reject
```

Backend should implement these with proper authentication and authorization.

## Validation Rules

### File Upload
- **Formats**: JPG, PNG, GIF
- **Size**: Max 10MB
- **Field**: Image file required

### Content
- **Title**: 3-100 characters, required
- **Subject**: Required, from predefined list
- **Description**: Max 500 characters, optional
- **Times**: End time must be after start time
- **Duration**: Optional, positive number in seconds

### Approval
- **Rejection Reason**: 5-500 characters, required for rejection

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001/api` |

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy to Other Platforms

```bash
# Build the app
pnpm build

# Deploy the `.next` folder to your hosting
```

Supports: Netlify, AWS, GCP, Azure, etc.

## Documentation

- **FRONTEND-NOTES.md**: Comprehensive technical documentation
- **Project Structure**: Organized by feature
- **API Layer**: Replaceable service design
- **Type Safety**: Full TypeScript coverage

## Debugging

### Common Issues

**API calls failing**
```bash
# Check backend is running
curl http://localhost:3001/api/auth/login

# Check .env.local has correct API_URL
cat .env.local
```

**Login not working**
- Clear browser localStorage: F12 → Application → localStorage → Clear
- Verify backend credentials match

**File upload fails**
- Check file size (<10MB)
- Check file type (JPG/PNG/GIF)
- Check backend upload endpoint

## Development

### Code Style
- TypeScript for type safety
- Functional components
- Custom hooks for logic
- Service layer for APIs
- Zod for validation

### Running Tests
```bash
# Tests coming soon
pnpm test
```

### Code Quality
```bash
# Type checking
pnpm type-check

# Linting (if configured)
pnpm lint
```

## Performance

- ⚡ Automatic code splitting with Next.js
- 🖼️ Image optimization
- 📦 Efficient bundling with Turbopack
- ⚙️ Component memoization
- 🔄 Smart caching

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR with description

## License

MIT

## Support

For issues or questions:
1. Check FRONTEND-NOTES.md for detailed docs
2. Review code comments and types
3. Check browser console for errors
4. Verify API backend is running

## Changelog

### v1.0.0
- Initial release
- Teacher upload and management
- Principal approval workflow
- Public live broadcast page
- Role-based authentication
- Form validation with Zod
- Responsive UI with shadcn/ui

---

**Built with ❤️ using React, Next.js, and TypeScript**
