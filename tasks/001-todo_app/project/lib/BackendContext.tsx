import { initialUsers } from "@/lib/exampleData";
import { User } from "./types";

const loggedInEmail = initialUsers[0].email;

export function BackendContext(props: { children: React.ReactNode }) {
  return <>{props.children}</>;
}

export function useLoggedInUser(): User {
  return initialUsers[0];
}
