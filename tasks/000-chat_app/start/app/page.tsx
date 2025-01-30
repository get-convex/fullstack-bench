'use client';

import { LoginForm } from "@/components/LoginForm";
import { redirect } from "next/navigation";

export default function Home() {
  const loggedIn = localStorage.getItem('username') !== null;

  if (!loggedIn) {
    return <LoginForm />;
  }

  // Redirect to the general channel
  redirect('/channels/general');
}
