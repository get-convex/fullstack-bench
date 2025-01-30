'use client';

import { LogoutButton } from "@/components/LogoutButton";
import { useUserEmail } from "@/components/WithUserEmail";

export default function Home() {
  const email = useUserEmail();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#151517]">
      <span className="text-white">Hello {email}!</span>
      <LogoutButton />
    </div>
  );
}
