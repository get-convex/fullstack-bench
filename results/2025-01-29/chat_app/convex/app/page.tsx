'use client';

import { LoginForm } from "@/components/LoginForm";
import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the general channel
  redirect('/channels/general');
}
