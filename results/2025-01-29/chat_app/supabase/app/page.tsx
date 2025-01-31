import { LoginForm } from "@/components/LoginForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }
  // Redirect to the general channel
  redirect('/channels/general');
}
