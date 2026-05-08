# Quick Start Guide

## 🚀 Get Running in 2 Minutes

### 1. Install & Run
```bash
# Install dependencies
pnpm install

# Set environment
cp .env.example .env.local

# Start development server
pnpm dev

# Open browser
open http://localhost:3000
```

### 2. Login & Explore
**Teacher Account:**
- Email: `teacher@example.com`
- Password: `password`

**Principal Account:**
- Email: `principal@example.com`
- Password: `password`

## 📋 Common Tasks

### Add a New Page
1. Create file: `app/feature/page.tsx`
2. Wrap with `<ProtectedRoute requiredRole="teacher">`
3. Use `<DashboardLayout>` for consistent styling
4. Import components and add content

### Create New Component
1. Create file: `src/components/feature/Component.tsx`
2. Export functional component
3. Add TypeScript types
4. Use shadcn/ui components for styling

### Add API Call
1. Update `src/services/feature.service.ts`
2. Use `apiGet`, `apiPost`, `apiPut`, `apiDelete` helpers
3. Define types in `src/types/index.ts`
4. Use service in component via custom hook

### Add Form
1. Create schema: `src/utils/validation.ts`
   ```typescript
   export const formSchema = z.object({
     field: z.string().min(1)
   });
   ```
2. Use `useForm` with schema
3. Add fields with `FormField` component
4. Submit via service layer

### Style Component
1. Use Tailwind classes
2. Import from `src/components/ui/*`
3. Use design tokens (bg-primary, text-muted-foreground)
4. Mobile-first responsive design

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with AuthProvider |
| `src/context/AuthContext.tsx` | Global auth state |
| `src/types/index.ts` | All TypeScript types |
| `src/services/*.service.ts` | API integration |
| `src/utils/validation.ts` | Form schemas |
| `src/utils/api.ts` | API client |

## 🧩 Component Template

```typescript
'use client';

import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
}

export const Component: FC<Props> = ({ title }) => {
  return (
    <div className="space-y-4">
      <h1>{title}</h1>
      <Button>Click me</Button>
    </div>
  );
};
```

## 🎯 Service Template

```typescript
import { apiGet, apiPost } from '@/utils/api';

class FeatureService {
  async getData(id: string) {
    const response = await apiGet(`/feature/${id}`);
    if (!response.success) throw new Error(response.error);
    return response.data;
  }
}

export const featureService = new FeatureService();
```

## 📝 Hook Template

```typescript
'use client';

import { useState, useCallback } from 'react';
import { featureService } from '@/services/feature.service';

export function useFeature() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await featureService.getData();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetch };
}
```

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Add Tailwind Color
Edit `app/globals.css`:
```css
@layer base {
  :root {
    --my-color: 220 90% 56%;
  }
}
```

Use: `text-my-color`

## 🐛 Debugging

### Check API Calls
```bash
# Terminal: Check API is running
curl http://localhost:3001/api/content/stats

# Browser: DevTools → Network tab
```

### Clear State
```javascript
// Console
localStorage.clear()
location.reload()
```

### Check Types
```bash
# Terminal
pnpm type-check
```

## 📦 Build & Deploy

### Local Build
```bash
pnpm build
pnpm start
```

### Vercel Deploy
```bash
vercel deploy
# Set env vars in Vercel dashboard
```

## 🎨 Styling Cheatsheet

```tsx
// Layout
<div className="flex items-center justify-between gap-4">

// Spacing
className="p-4 m-2 gap-4"

// Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Typography
className="text-2xl font-bold text-muted-foreground"

// Colors
className="bg-primary text-primary-foreground"

// States
className="disabled:opacity-50 hover:bg-muted"
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| API 404 | Check NEXT_PUBLIC_API_URL in .env.local |
| Login fails | Verify credentials and API running |
| Components missing | Run `pnpm install` |
| TypeScript errors | Run `pnpm type-check` |
| Build fails | Clear `.next` folder and rebuild |
| Styles not applying | Check class names and rebuild |

## 📚 Documentation

- **Full Docs**: FRONTEND-NOTES.md
- **API Contract**: API-INTEGRATION.md
- **Project Overview**: PROJECT-SUMMARY.md
- **Setup Details**: README.md

## 💡 Tips & Tricks

**Use React DevTools**
```
Chrome Extension: React Developer Tools
Firefox Add-on: React DevTools
```

**Format Code**
```bash
pnpm format  # if configured
```

**Check Dependencies**
```bash
pnpm list
```

**Update Dependencies**
```bash
pnpm update
```

## 🚀 Next Steps

1. ✅ Backend: Implement API endpoints from API-INTEGRATION.md
2. ✅ Test: Verify all flows with backend
3. ✅ Deploy: Push to Vercel or your platform
4. ✅ Monitor: Set up error tracking
5. ✅ Enhance: Add features from roadmap

## 🎓 Learning Path

1. Read: `app/page.tsx` (routing/redirects)
2. Read: `src/context/AuthContext.tsx` (state management)
3. Read: `src/services/auth.service.ts` (API integration)
4. Read: `app/teacher/dashboard/page.tsx` (page structure)
5. Read: `src/components/teacher/UploadForm.tsx` (forms)

## 📞 Support

- Check error messages in browser console
- Read full documentation in FRONTEND-NOTES.md
- Review API contract in API-INTEGRATION.md
- Check type definitions in src/types/index.ts

---

**Now you're ready! Happy coding! 🎉**
