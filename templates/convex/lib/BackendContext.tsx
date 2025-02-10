"use client";

import { api } from "@/convex/_generated/api";
import { ConvexAuthProvider, useAuthActions } from "@convex-dev/auth/react";
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { User } from "./types";
import { Spinner } from "@/components/Spinner";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const UserEmailContext = createContext<User | null>(null);

export function BackendContext(props: { children: React.ReactNode }) {
  return (
    <ConvexAuthProvider client={convex}>
      <AuthLoading>
        <Spinner />
      </AuthLoading>
      <Unauthenticated>
        <LoginForm />
      </Unauthenticated>
      <Authenticated>
        <SetUserEmail>{props.children}</SetUserEmail>
      </Authenticated>
    </ConvexAuthProvider>
  );
}

export function useLoggedInUser(): User {
  const user = useContext(UserEmailContext);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

function SetUserEmail(props: { children: React.ReactNode }) {
  const currentUser = useQuery(api.auth.getLoggedInUser);
  if (currentUser === undefined) {
    return <Spinner />;
  }
  const email = currentUser?.email;
  if (!email) {
    throw new Error("User email not found");
  }
  return (
    <UserEmailContext.Provider value={{ id: currentUser._id, email }}>
      {props.children}
    </UserEmailContext.Provider>
  );
}

function LoginForm() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
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
              await signIn("password", formData);
            } catch (error) {
              let message = "Failed to sign in. Please try again.";
              if (error instanceof Error) {
                if (error.message.includes("InvalidSecret")) {
                  message = "Invalid email or password. Please try again.";
                } else if (error.message.includes("already exists")) {
                  message = "User already exists. Please sign in.";
                }
              }
              toast.error(message);
            }
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#E1E1E3] mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
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
            <input name="flow" type="hidden" value={step} />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#8D2676] hover:bg-[#7A2065] text-white rounded py-2 text-sm font-medium transition-colors mb-3"
            >
              {step === "signUp" ? "Sign up" : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(step === "signUp" ? "signIn" : "signUp");
              }}
              className="w-full text-[#8D2676] hover:text-[#7A2065] bg-transparent text-sm font-medium transition-colors"
            >
              {step === "signUp" ? "Sign in instead" : "Sign up instead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
