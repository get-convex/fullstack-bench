export interface User {
  id: string;
  email: string;
}

export interface Channel {
  id: string;
  createdAt: number;
  name: string;
}

export interface Message {
  id: string;
  createdAt: number;
  channelId: string;
  userId: string;
  content: string;
}