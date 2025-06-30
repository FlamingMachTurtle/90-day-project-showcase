'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
    >
      Logout
    </button>
  );
}

export function CompactLogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors duration-200"
    >
      Logout
    </button>
  );
} 