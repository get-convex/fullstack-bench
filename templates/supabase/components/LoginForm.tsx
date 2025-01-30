'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Store username in localStorage for persistence
      localStorage.setItem('username', username.trim());

      // Redirect to the general channel
      router.push('/channels/general');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#151517]">
      <div className="w-[400px] p-8 rounded-lg border border-[#26262b] bg-[#1D1D1F]">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-medium text-white mb-2">Welcome to Chat</h1>
          <p className="text-sm text-[#A1A1A3]">Enter your name to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#E1E1E3] mb-2">
              Display Name
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#26262b] text-white placeholder-[#A1A1A3] border border-[#363639] focus:border-[#8D2676] focus:outline-none text-sm"
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#8D2676] hover:bg-[#7A2065] text-white rounded py-2 text-sm font-medium transition-colors"
          >
            Join Chat
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#26262b]">
          <p className="text-xs text-[#A1A1A3] text-center">
            This is a demo chat application. No authentication required.
          </p>
        </div>
      </div>
    </div>
  );
}

