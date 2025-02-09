import { atom, useAtom } from "jotai";
import { User } from "../types";
import { initialUsers } from "./init";

export function useUsers() {
  const [currentUsers, _] = useAtom(users);
  return currentUsers;
}

export function useUserByEmail(email: string) {
  const [currentUsers, _] = useAtom(users);
  return currentUsers.find((user) => user.email === email);
}

export function useUser(id: string) {
  const [currentUsers, _] = useAtom(users);
  return currentUsers.find((user) => user.id === id);
}

export function useUsersById(ids: string[]) {
  const [currentUsers, _] = useAtom(users);
  return Object.fromEntries(currentUsers.filter((user) => ids.includes(user.id)).map((user) => [user.id, user])) as Record<string, User>;
}

export const users = atom<User[]>(initialUsers);

