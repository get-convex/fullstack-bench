import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Channel, Message } from "./types";
import { Id } from "@/convex/_generated/dataModel";

export function useChannels() {
  return useQuery(api.channels.list);
}

export function useCreateChannel() {
  return useMutation(api.channels.create);
}

export function useMessages(channelId: Id<"channels">) {
  return useQuery(api.messages.list, { channelId });
}

export function useSendMessage() {
  return useMutation(api.messages.send);
}
