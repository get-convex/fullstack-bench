"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "./types";
import { browserClient } from "./browserClient";

const UserContext = createContext<User | undefined>(undefined);

export function BackendContext(props: { children: React.ReactNode }) {
  const supabase = browserClient();
  const [user, setUser] = useState<User | undefined | null>(undefined);
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user && { id: user.id, email: user.email! });
    };
    getUser();
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#151517]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8D2676] border-t-transparent" />
      </div>
    );
  }
  return (
    <UserContext.Provider value={user!}>{props.children}</UserContext.Provider>
  );
}

export function useLoggedInUser() {
  return useContext(UserContext)!;
}
