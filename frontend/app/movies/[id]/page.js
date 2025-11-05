'use client';
import { useParams } from 'next/navigation';
import MovieForm from '@/components/MovieForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditMoviePage() {
  const params = useParams();
  
  return <ProtectedRoute><MovieForm movieId={params.id} /></ProtectedRoute>;
}