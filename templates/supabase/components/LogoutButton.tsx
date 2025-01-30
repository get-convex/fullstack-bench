'use client';

import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export function LogoutButton() {
  const supabase = createClient();
  const logout = async () => {
    await supabase.auth.signOut();
    redirect('/');
  };
  return (
    <button
      onClick={() => void logout()}
      className="fixed top-4 right-4 px-4 py-2 text-sm font-medium text-white bg-[#8D2676] hover:bg-[#7A2065] rounded transition-colors"
    >
      Sign Out
    </button>
  );
}