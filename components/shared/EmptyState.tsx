import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
        {Icon && (
          <Icon className="h-12 w-12 text-muted-foreground opacity-50" />
        )}
        <div className="space-y-2 max-w-sm">
          <p className="text-lg font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action && (
          <Link href={action.href}>
            <Button className="mt-4">{action.label}</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
