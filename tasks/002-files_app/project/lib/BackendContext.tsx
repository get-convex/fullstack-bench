import { initialUsers } from "@/lib/state/init";
import { useUserByEmail } from "./state/users";
import { User } from "./types";

const loggedInEmail = initialUsers[0].email;

export function BackendContext(props: { children: React.ReactNode }) {
  return <>{props.children}</>;
}

export function useLoggedInUser(): User {
  const user = useUserByEmail(loggedInEmail);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
