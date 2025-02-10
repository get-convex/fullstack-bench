import { atom, getDefaultStore, useAtom } from "jotai";
import { Channel, Message, User } from "../types";
import { initialChannels, initialMessages, initialUsers } from "./init";

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

export async function createChannel(name: string): Promise<string> {
  const currentChannels = store.get(channels);
  const id = crypto.randomUUID();
  if (currentChannels.find((channel) => channel.name === name)) {
    throw new Error(`Channel with name ${name} already exists`);
  }
  store.set(channels, [...currentChannels, { id, name, createdAt: Date.now() }]);
  return id;
}

export function useMessages(channelId: string) {
  const [currentMessages] = useAtom(messages);
  const results = currentMessages.filter((message) => message.channelId === channelId);
  results.sort((a, b) => a.createdAt - b.createdAt);
  return results;
}

export async function sendMessage(userId: string, content: string, channelId: string): Promise<void> {
  const currentChannels = store.get(channels);
  const channel = currentChannels.find((channel) => channel.id === channelId);
  if (!channel) {
    throw new Error(`Channel with id ${channelId} not found`);
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
}

const users = atom<User[]>(initialUsers);
const channels = atom<Channel[]>(initialChannels);
const messages = atom<Message[]>(initialMessages);