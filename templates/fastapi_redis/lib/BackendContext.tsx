"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { User } from "./types";
import { Spinner } from "@/components/Spinner";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error(`NEXT_PUBLIC_BACKEND_URL not set`);
}

export async function backendFetch(
  path: string,
  options?: {
    method?: "GET" | "POST";
    headers?: Record<string, string>;
  }
) {
  const method = options?.method ?? "GET";
  const headers = options?.headers ?? {};
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  const resp = await fetch(`${BACKEND_URL}${path}`, {
    headers,
    method,
  });
  if (!resp.ok) {
    if (resp.status === 401 && accessToken) {
      console.error(`Clearing access token on 401`);
      localStorage.removeItem("access_token");
    }
    const body = await resp.text();
    throw new Error(`${resp.statusText}: ${body}`);
  }
  const json = await resp.json();
  return json;
}

const UserEmailContext = createContext<User | null>(null);

const queryClient = new QueryClient();

export function BackendContext(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadAuth>{props.children}</LoadAuth>
    </QueryClientProvider>
  );
}

function LoadAuth(props: { children: React.ReactNode }) {
  const r = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const user = await backendFetch("/auth/current_user");
      return user as User | null;
    },
    retry: false,
  });
  if (r.isLoading) {
    return <Spinner />;
  }
  if (r.error || r.data === null) {
    return <LoginForm loadUser={r.refetch} />;
  }
  return (
    <UserEmailContext.Provider value={r.data!}>
      {props.children}
    </UserEmailContext.Provider>
  );
}

export function useLoggedInUser(): User {
  const user = useContext(UserEmailContext);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

function LoginForm(props: { loadUser: () => void }) {
  const [step, setStep] = useState<"signup" | "login">("login");
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#151517]">
      <div className="w-[400px] p-8 rounded-lg border border-[#26262b] bg-[#1D1D1F]">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-medium text-white mb-2">Welcome!</h1>
        </div>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            try {
              const resp = await fetch(`${BACKEND_URL}/auth/${step}`, {
                method: "POST",
                body: formData,
              });
              if (!resp.ok) {
                const body = await resp.text();
                throw new Error(`Failed to ${step}: ${body}`);
              }
              const body = await resp.json();
              localStorage.setItem("access_token", body.access_token);
              props.loadUser();
            } catch (error: any) {
              console.error(error);
              toast.error(`Failed to ${step}.`);
            }
          }}
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[#E1E1E3] mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="username"
              className="w-full px-3 py-2 rounded bg-[#26262b] text-white placeholder-[#A1A1A3] border border-[#363639] focus:border-[#8D2676] focus:outline-none text-sm"
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#E1E1E3] mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 rounded bg-[#26262b] text-white placeholder-[#A1A1A3] border border-[#363639] focus:border-[#8D2676] focus:outline-none text-sm"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#8D2676] hover:bg-[#7A2065] text-white rounded py-2 text-sm font-medium transition-colors mb-3"
            >
              {step === "signup" ? "Sign up" : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(step === "signup" ? "login" : "signup");
              }}
              className="w-full text-[#8D2676] hover:text-[#7A2065] bg-transparent text-sm font-medium transition-colors"
            >
              {step === "signup" ? "Sign in instead" : "Sign up instead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
