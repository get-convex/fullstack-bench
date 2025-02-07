'use client';

import { AuthLoading, Unauthenticated, Authenticated, useQuery } from 'convex/react';
import { LoginForm } from './LoginForm';
import { useAuthActions } from '@convex-dev/auth/react';
import React from 'react';
import { api } from '@/convex/_generated/api';

export function WithUserEmail(props: { children: React.ReactNode; }) {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center bg-[#151517]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8D2676] border-t-transparent" />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <LoginForm />
      </Unauthenticated>
      <Authenticated>
        <SetUserEmail>
          {props.children}
        </SetUserEmail>
      </Authenticated>
    </>
  );
}

const UserEmailContext = React.createContext<string>("");

export function useUserEmail() {
  return React.useContext(UserEmailContext);
}

function SetUserEmail(props: { children: React.ReactNode }) {
  const currentUser = useQuery(api.auth.getLoggedInUser);
  if (currentUser === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-[#151517]"> <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8D2676] border-t-transparent" /> </div>
  }
  const email = currentUser?.email;
  if (!email) {
    throw new Error("User email not found");
  }
  return (
    <UserEmailContext.Provider value={email}>
      {props.children}
    </UserEmailContext.Provider>
  );
}


