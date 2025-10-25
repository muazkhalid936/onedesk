"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { initializeDummyData } = useWorkspaceStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Initialize dummy data when component mounts
    initializeDummyData();
  }, [initializeDummyData]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <DashboardLayout />;
}
