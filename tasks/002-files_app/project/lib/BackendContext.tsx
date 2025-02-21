import { initialUsers } from "@/lib/exampleData";
import { User } from "./types";
import { Spinner } from "@/components/Spinner";
const loggedInEmail = initialUsers[0].email;

export function BackendContext(props: { children: React.ReactNode }) {
  return <>{props.children}</>;
}

export function useLoggedInUser(): User {
  const user =
    initialUsers.find((user) => user.email === loggedInEmail) ?? null;
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
