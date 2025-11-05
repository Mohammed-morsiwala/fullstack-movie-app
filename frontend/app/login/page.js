'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AppWrapper from '@/components/AppWrapper';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/movies');
    }
  }, [router]);

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        router.push('/movies');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      alert("in catch");
      setError('An unexpected error occurred');
    } finally {
      alert("in finally");
      setIsLoading(false);
    }
  };

  return (
    <AppWrapper className="flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-[300px] relative z-10">
        <h1 className="text-[64px] font-semibold text-white text-center mb-10 leading-tight">
          Sign in
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-[10px] py-[10px] bg-[#224957] text-white text-sm
                       rounded-[10px] placeholder-white/50 
                       focus:outline-none focus:ring-1 focus:ring-white/20
                       border-0"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-[10px] py-[10px] bg-[#224957] text-white text-sm
                       rounded-[10px] placeholder-white/50 
                       focus:outline-none focus:ring-1 focus:ring-white/20
                       border-0"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-[#EB5757] text-sm text-center bg-[#EB5757]/10 py-2 px-4 rounded-[10px]">
              {error}
            </div>
          )}

          <div className="flex items-center justify-center">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 w-[18px] h-[18px] rounded accent-[#2BD17E]"
              />
              <span className="text-white text-sm">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-[10px] bg-[#2BD17E] text-white rounded-[10px] font-bold text-base
                     hover:bg-[#229B60] transition disabled:opacity-50 
                     disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Don't Have and account?{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-[#2BD17E] hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </AppWrapper>
  );
}