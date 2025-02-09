import { Id } from "@/convex/_generated/dataModel";

export interface User {
  id: Id<"users">;
  email: string;
}