'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Upload,
  FileText,
  CheckCircle,
  List,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const teacherLinks = [
  {
    name: 'Dashboard',
    href: '/teacher/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Upload Content',
    href: '/teacher/upload',
    icon: Upload,
  },
  {
    name: 'My Content',
    href: '/teacher/my-content',
    icon: FileText,
  },
];

const principalLinks = [
  {
    name: 'Dashboard',
    href: '/principal/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Pending Approvals',
    href: '/principal/approvals',
    icon: CheckCircle,
  },
  {
    name: 'All Content',
    href: '/principal/all-content',
    icon: List,
  },
];

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const links = user?.role === 'teacher' ? teacherLinks : principalLinks;

  return (
    <aside className="hidden md:flex w-64 border-r border-border bg-muted/50 flex-col">
      <div className="flex-1 px-4 py-8 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
