'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { register } = useAuthStore();

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const result = await register(email, password);
      
      if (result.success) {
        router.push('/movies');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#093545] px-4">
      <div className="w-full max-w-md">
        <h1 className="text-5xl md:text-6xl font-semibold text-white text-center mb-10">
          Sign up
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#224957] text-white rounded-lg 
                       placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-[#2BD17E] transition"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#224957] text-white rounded-lg 
                       placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-[#2BD17E] transition"
              disabled={isLoading}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#224957] text-white rounded-lg 
                       placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-[#2BD17E] transition"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 px-4 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#2BD17E] text-white rounded-lg font-semibold 
                     hover:bg-[#24B56E] transition disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-[#2BD17E] hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}