import { atom, getDefaultStore, useAtom } from "jotai";
import { Channel, Message, User } from "../types";
import { initialChannels, initialMessages, initialUsers } from "./init";

const store = getDefaultStore();

export function useUserByEmail(email: string) {
  const [currentUsers, _] = useAtom(users);
  return currentUsers.find((user) => user.email === email);
}

export function useChannels(): Channel[] | undefined {
  const [currentChannels, _] = useAtom(channels);
  currentChannels.sort((a, b) => a.createdAt - b.createdAt);
  return currentChannels;
}

export function useChannel(channelId: string): Channel | null | undefined {
  const [currentChannels, _] = useAtom(channels);
  const channel = currentChannels.find((channel) => channel.id === channelId);
  if (!channel) {
    return null;
  }
  return channel;
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

export function useMessages(channelId: string): (Message & { userEmail: string })[] | undefined {
  const [currentMessages] = useAtom(messages);
  const [currentUsers] = useAtom(users);
  const results = currentMessages
    .filter((message) => message.channelId === channelId)
    .map((message) => {
      const user = currentUsers.find((user) => user.id === message.userId);
      if (!user) {
        throw new Error(`User with id ${message.userId} not found`);
      }
      return {
        ...message,
        userEmail: user.email,
      };
    });
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