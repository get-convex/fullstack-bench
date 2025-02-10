"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const channels = useQuery(api.channels.listChannels) ?? [];
  if (channels.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div>Create a channel to get started!</div>
      </div>
    );
  } else {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div>Pick a channel!</div>
      </div>
    );
  }
}
