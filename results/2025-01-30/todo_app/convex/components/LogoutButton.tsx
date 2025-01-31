'use client';

import { useAuthActions } from '@convex-dev/auth/react';

export function LogoutButton() {
  const { signOut } = useAuthActions();
  return (
    <button
      onClick={() => void signOut()}
      className="fixed top-4 right-4 px-4 py-2 text-sm font-medium text-white bg-[#8D2676] hover:bg-[#7A2065] rounded transition-colors"
    >
      Sign Out
    </button>
  );
}