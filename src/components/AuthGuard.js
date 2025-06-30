'use client';

import { useAuth } from '@/contexts/AuthContext';
import PasswordGate from './PasswordGate';

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PasswordGate />;
  }

  return children;
} 