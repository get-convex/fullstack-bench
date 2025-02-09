"use client";

import { useLoggedInUser } from "@/lib/BackendContext";

export default function Home() {
  const user = useLoggedInUser();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#151517]">
      <span className="text-white">Hello {user.email}!</span>
    </div>
  );
}
