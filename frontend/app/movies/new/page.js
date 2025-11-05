'use client';
import MovieForm from '@/components/MovieForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NewMoviePage() {
  return <ProtectedRoute><MovieForm /></ProtectedRoute>;
}