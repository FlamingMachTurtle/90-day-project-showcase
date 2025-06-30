'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  // Handle cooldown timer
  useEffect(() => {
    let interval;
    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1000) {
            setError('');
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [remainingTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (remainingTime > 0) {
      const minutes = Math.ceil(remainingTime / 1000 / 60);
      setError(`Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to intended page
        router.push(redirectPath);
        router.refresh();
      } else {
        // Handle different error types
        if (response.status === 429) {
          // Rate limited
          setRemainingTime(data.remainingTime);
          setError(data.error);
        } else {
          // Wrong password
          setAttempts(data.attempts || 0);
          setError(data.error);
          
          // Show progressive warning messages
          if (data.attempts >= 3) {
            setError(`${data.error}. ${data.attempts}/10 attempts used.`);
          }
          if (data.attempts >= 8) {
            setError(`${data.error}. WARNING: Further attempts will result in longer cooldowns.`);
          }
        }
        
        // Clear password field on error
        setPassword('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 1000 / 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              90-Day Showcase
            </h1>
            <p className="text-white/70 text-sm">
              Enter password to access the portfolio
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading || remainingTime > 0}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                autoFocus
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-200 text-sm">{error}</p>
                {remainingTime > 0 && (
                  <p className="text-red-300 text-xs mt-1">
                    Time remaining: {formatTime(remainingTime)}
                  </p>
                )}
              </div>
            )}

            {/* Attempt Counter */}
            {attempts > 0 && remainingTime === 0 && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3">
                <p className="text-yellow-200 text-sm">
                  Failed attempts: {attempts}/10
                  {attempts >= 3 && (
                    <span className="block text-yellow-300 text-xs mt-1">
                      Progressive cooldowns apply after more failures
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || remainingTime > 0}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </div>
              ) : remainingTime > 0 ? (
                `Wait ${formatTime(remainingTime)}`
              ) : (
                'Access Portfolio'
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-white/50 text-xs">
              🔒 Protected by secure authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 