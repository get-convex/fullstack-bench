"use client";

import { atom, getDefaultStore, useAtom } from "jotai";
import { Channel, Message, User } from "./types";

const store = getDefaultStore();

export function useUsersById(ids: string[]) {
  const [currentUsers, _] = useAtom(users);
  return Object.fromEntries(currentUsers.filter((user) => ids.includes(user.id))
    .map((user) => [user.id, user]));
}

export function useUserByEmail(email: string) {
  const [currentUsers, _] = useAtom(users);
  return currentUsers.find((user) => user.email === email);
}

export function useChannels() {
  const [currentChannels, _] = useAtom(channels);
  currentChannels.sort((a, b) => a.createdAt - b.createdAt);
  return currentChannels;
}

export function useChannel(channelId: string) {
  const [currentChannels, _] = useAtom(channels);
  return currentChannels.find((channel) => channel.id === channelId);
}

export async function createChannel(name: string): Promise<{ type: "success", channelId: string } | { type: "error", message: string }> {
  const currentChannels = store.get(channels);
  const id = crypto.randomUUID();
  if (currentChannels.find((channel) => channel.name === name)) {
    return { type: "error", message: `Channel with name ${name} already exists` };
  }
  store.set(channels, [...currentChannels, { id, name, createdAt: Date.now() }]);
  return { type: "success", channelId: id };
}

export function useMessages(channelId: string) {
  const [currentMessages] = useAtom(messages);
  const results = currentMessages.filter((message) => message.channelId === channelId);
  results.sort((a, b) => a.createdAt - b.createdAt);
  return results;
}

export async function sendMessage(userId: string, content: string, channelId: string): Promise<{ type: "success" } | { type: "error", message: string }> {
  const currentChannels = store.get(channels);
  const channel = currentChannels.find((channel) => channel.id === channelId);
  if (!channel) {
    return { type: "error", message: `Channel with id ${channelId} not found` };
  }
  const currentMessages = store.get(messages);
  const message: Message = {
    id: crypto.randomUUID(),
    channelId,
    userId,
    content,
    createdAt: Date.now(),
  };
  store.set(messages, [...currentMessages, message]);
  return { type: "success" };
}

const userId1 = 'c54555b3-5df1-4862-9aea-664ad2e66b05';
const userId2 = '7496e663-3efc-48fc-92d2-8196979bb400';
const userId3 = '00a325f0-8b02-4cb4-9dab-31716deb06ec';
const users = atom<User[]>([
  {
    id: userId1,
    email: 'joe@example.com',
  },
  {
    id: userId2,
    email: 'bob@example.com',
  },
  {
    id: userId3,
    email: 'alice@example.com',
  },
]);

let base = (new Date("2025-02-04 12:00:00")).getTime();
function getTimestamp() {
  base += 1000 * 60;
  return base;
}

const channelId1 = '8905e7e1-2a36-4264-8f55-4539f77cf3bf';
const channelId2 = '2037d2ed-c0be-4a65-b948-2dfcb2627403';
const channels = atom<Channel[]>([
  { id: channelId1, name: "general", createdAt: getTimestamp() },
  { id: channelId2, name: "random", createdAt: getTimestamp() },
]);

const messageId1 = '5d97e337-1166-412d-a102-24349f1620e4';
const messageId2 = '9621f96a-8a85-40b5-8b17-d38178522a5b';
const messages = atom<Message[]>([
  { id: messageId1, channelId: channelId1, userId: userId1, content: "Four score and seven years ago...", createdAt: getTimestamp(), },
  { id: messageId2, channelId: channelId2, userId: userId2, content: "Foursquare and Seven Rooms...", createdAt: getTimestamp(), },
]);