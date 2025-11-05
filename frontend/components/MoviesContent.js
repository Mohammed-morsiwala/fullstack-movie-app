'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut } from 'lucide-react';
import api from '@/lib/api';
import AppWrapper from '@/components/AppWrapper';
import PageContainer from '@/components/PageContainer';
import { useAuthStore } from '@/store/authStore';


export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/movies?page=${page}&limit=8`);
      setMovies(response.data.data);
      setTotalPages(response.data.pagination.pages);
      setError('');
    } catch (error) {
      console.error('Error fetching movies:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load movies');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading && movies.length === 0) {
    return (
      <AppWrapper className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2BD17E]"></div>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <PageContainer>
        {/* Header */}
        <div className="flex md:flex-row justify-between items-start md:items-center mb-12 md:mb-20 gap-4">
          {movies?.length >= 1 && (
            <div className="flex items-center gap-3 md:gap-4">
              <h1 className="text-3xl md:text-5xl font-semibold text-white">
                My movies
              </h1>
              <button 
                onClick={() => router.push('/movies/new')}
                className="border-2 rounded-full text-base text-white transition"
              >
                <Plus size={20} />
              </button>
            </div>
          )}
         
          
          <button 
            onClick={handleLogout}
            className="ml-auto flex items-center gap-2 text-white hover:text-[#2BD17E] transition font-bold"
          >
            <LogOut size={24} />
          </button>
        </div>

        {error && (
          <div className="text-[#EB5757] text-center mb-6 bg-[#EB5757]/10 py-3 px-4 rounded-[10px]">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && movies.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-10">
              Your movie list is empty
            </h2>
            <button 
              onClick={() => router.push('/movies/new')}
              className="bg-[#2BD17E] text-white px-7 py-4 rounded-[10px] hover:bg-[#229B60] 
                       transition font-bold text-base"
            >
              Add a new movie
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {movies.map((movie) => (
                <div 
                  key={movie._id}
                  onClick={() => router.push(`/movies/${movie._id}`)}
                  className="bg-[#092C39] rounded-[12px] overflow-hidden cursor-pointer 
                           hover:scale-[1.02] transition-transform duration-300 
                           shadow-lg group"
                >
                  {/* Movie Image */}
                  <div className="relative aspect-[2/3] overflow-hidden">
                    {movie.poster ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${movie.poster}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/282x400?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#224957] flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay - Optional */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                  </div>
                  
                  {/* Movie Info - Figma Style */}
                  <div className="p-4">
                    <h3 className="text-white text-lg md:text-xl font-medium mb-2 truncate">
                      {movie.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {movie.publishingYear}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination*/}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 md:mt-20">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-white disabled:opacity-30 disabled:cursor-not-allowed 
                           hover:text-[#2BD17E] transition font-bold text-base"
                >
                  Prev
                </button>
                
                <div className="flex gap-2">
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-[4px] font-bold text-base transition
                          ${page === pageNum 
                            ? 'bg-[#2BD17E] text-white' 
                            : 'bg-[#092C39] text-white hover:bg-[#224957]'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-white disabled:opacity-30 disabled:cursor-not-allowed 
                           hover:text-[#2BD17E] transition font-bold text-base"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </PageContainer>
    </AppWrapper>
  );
}