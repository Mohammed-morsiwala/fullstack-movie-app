'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { token, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) router.replace('/login');
    }
  }, [checkAuth, router]);

  if (typeof window === 'undefined') return null; 
  if (!token && !localStorage.getItem('token')) return null;

  return children;
}
