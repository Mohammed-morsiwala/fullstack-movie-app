'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import MoviesContent from '@/components/MoviesContent'; 

export default function MoviesPage() {
  return (
    <ProtectedRoute>
      <MoviesContent />
    </ProtectedRoute>
  );
}
