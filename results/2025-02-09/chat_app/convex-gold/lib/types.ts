import { Id } from "@/convex/_generated/dataModel";

export interface User {
  id: Id<"users">;
  email: string;
}

export interface Channel {
  _id: Id<"channels">;
  _creationTime: number;
  name: string;
}

export interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  channelId: Id<"channels">;
  userId: Id<"users">;
  content: string;
}