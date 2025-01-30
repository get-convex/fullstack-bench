'use client';
import { createClient } from '@/utils/supabase/client';
import React, { useState, useEffect } from 'react';

const UserEmailContext = React.createContext<string>("");

export function WithUserEmail(props: { children: React.ReactNode; }) {
  const supabase = createClient();
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email ?? null);
    };
    getUser();
  }, []);

  if (email === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-[#151517]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8D2676] border-t-transparent"/>
    </div>;
  }
  return (
    <UserEmailContext.Provider value={email!}>
      {props.children}
    </UserEmailContext.Provider>
  );
}

export function useUserEmail() {
  return React.useContext(UserEmailContext);
}
