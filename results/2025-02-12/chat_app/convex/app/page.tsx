"use client";

import { useChannels } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { WithSidebar } from "./WithSidebar";
import { Spinner } from "@/components/Spinner";

export default function Home() {
  const router = useRouter();
  const channels = useChannels();

  useEffect(() => {
    if (!channels?.length) return;

    router.replace(`/channels/${channels[0]._id}`);
  }, [channels, router]);

  if (channels === undefined) return <Spinner />;

  return (
    <WithSidebar>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-slate-400">Create your first channel!</div>
      </div>
    </WithSidebar>
  );
}
