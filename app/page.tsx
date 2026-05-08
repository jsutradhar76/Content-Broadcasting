'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/spinner';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleNavigation = useCallback(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/auth');
    } else if (user.role === 'teacher') {
      router.push('/teacher/dashboard');
    } else if (user.role === 'principal') {
      router.push('/principal/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNavigation();
    }, 0);

    return () => clearTimeout(timer);
  }, [handleNavigation]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
