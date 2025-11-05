'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import api from '@/lib/api';
import AppWrapper from '@/components/AppWrapper';
import PageContainer from '@/components/PageContainer';

export default function MovieForm({ movieId = null, initialData = null }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState('');
  const [currentPoster, setCurrentPoster] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!movieId);
  
  const router = useRouter();
  const isEditMode = !!movieId;

  // Load movie data if editing
  useEffect(() => {
    if (movieId) {
      fetchMovie();
    } else if (initialData) {
      setTitle(initialData.title || '');
      setYear(initialData.publishingYear?.toString() || '');
      setCurrentPoster(initialData.poster || '');
      setIsLoadingData(false);
    }
  }, [movieId, initialData]);

  const fetchMovie = async () => {
    try {
      const response = await api.get(`/api/movies/${movieId}`);
      const movie = response.data.data;
      
      setTitle(movie.title);
      setYear(movie.publishingYear.toString());
      setCurrentPoster(movie.poster);
    } catch (error) {
      console.error('Error fetching movie:', error);
      setError('Failed to load movie');
      router.push('/movies');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setPoster(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const yearNum = parseInt(year);
    if (!yearNum || yearNum < 1888 || yearNum > new Date().getFullYear() + 5) {
      setError('Please enter a valid year (1888 - ' + (new Date().getFullYear() + 5) + ')');
      return;
    }

    // Only require poster for new movies
    if (!isEditMode && !poster) {
      setError('Please upload a movie poster');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('publishingYear', yearNum);
      
      if (poster) {
        formData.append('poster', poster);
      }

      if (isEditMode) {
        await api.put(`/api/movies/${movieId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/api/movies', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      router.push('/movies');
    } catch (err) {
      console.error('Movie form error:', err);
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} movie`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <AppWrapper className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2BD17E]"></div>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <PageContainer maxWidth="1000px">
        <h1 className="text-3xl md:text-5xl font-semibold text-white mb-12 md:mb-16">
          {isEditMode ? 'Edit' : 'Create a new movie'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Image Upload Area */}
            <div className="flex-shrink-0 w-full md:w-[473px]">
              <label 
                className="block cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className={`w-full h-[400px] md:h-[504px] rounded-[10px] border-2 border-dashed 
                              flex items-center justify-center transition-all
                              ${preview || currentPoster ? 'border-transparent' : 'border-white/20 bg-[#224957]'}
                              hover:border-[#2BD17E]`}>
                  {preview ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-[10px]"
                      />
                    </div>
                  ) : currentPoster ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${currentPoster}`}
                        alt="Current" 
                        className="w-full h-full object-cover rounded-[10px]"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/473x504?text=No+Image';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <Download className="mx-auto mb-2 text-white" size={24} />
                      <span className="text-white text-sm">Drop an image here</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-[10px] bg-[#224957] text-white text-sm
                           rounded-[10px] placeholder-white/50 
                           focus:outline-none focus:ring-1 focus:ring-white/20
                           border-0"
                  disabled={isLoading}
                />
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Publishing year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full md:w-[216px] px-4 py-[10px] bg-[#224957] text-white text-sm
                           rounded-[10px] placeholder-white/50
                           focus:outline-none focus:ring-1 focus:ring-white/20
                           border-0"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="text-[#EB5757] text-sm bg-[#EB5757]/10 py-2 px-4 rounded-[10px]">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/movies')}
                  className="flex-1 md:flex-none md:w-[167px] py-[15px] 
                           border border-white text-white rounded-[10px] text-base font-bold
                           hover:bg-white/5 transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 md:flex-none md:w-[167px] py-[15px] 
                           bg-[#2BD17E] text-white rounded-[10px] text-base font-bold
                           hover:bg-[#229B60] transition disabled:opacity-50 
                           disabled:cursor-not-allowed"
                >
                  {isLoading 
                    ? (isEditMode ? 'Updating...' : 'Creating...') 
                    : (isEditMode ? 'Update' : 'Submit')
                  }
                </button>
              </div>
            </div>
          </div>
        </form>
      </PageContainer>
    </AppWrapper>
  );
}