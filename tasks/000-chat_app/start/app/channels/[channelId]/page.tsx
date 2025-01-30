import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Channel from "./Channel";

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }
  return <Channel user={user} channelId={resolvedParams.channelId} />;
}
