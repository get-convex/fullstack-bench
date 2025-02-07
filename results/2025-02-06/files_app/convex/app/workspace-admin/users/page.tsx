"use client";

import { useWorkspace } from "@/hooks/useWorkspace";
import { useUser } from "@/components/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
export default function UsersPage() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { users, isLoading, addUser, removeUser, updateUserRole } = useWorkspace();
  const [newUserEmail, setNewUserEmail] = useState("");

  if (!isAdmin) {
    router.push("/");
    return null;
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;

    try {
      await addUser(newUserEmail, false);
      setNewUserEmail("");
      toast.success("User added successfully");
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  const handleRemoveUser = async (userId: Id<"users">) => {
    try {
      await removeUser(userId);
      toast.success("User removed successfully");
    } catch (error) {
      toast.error("Failed to remove user");
    }
  };

  const handleToggleAdmin = async (userId: Id<"users">, currentIsAdmin: boolean) => {
    try {
      await updateUserRole(userId, !currentIsAdmin);
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/workspace-admin"
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              ← Back to Workspace Admin
            </Link>
            <h1 className="text-2xl font-bold text-white">Users</h1>
          </div>
        </div>
      </div>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="mb-8">
        <div className="flex gap-4">
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="Enter user email"
            className="flex-1 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-[#8D2676] text-white rounded-md hover:bg-[#7D1666] transition-colors"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Add User
          </button>
        </div>
      </form>

      {/* Users List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-[#26262b] rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 bg-[#26262b] rounded-md"
            >
              <div>
                <p className="text-white">{user.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleAdmin(user.userId, user.isAdmin)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    user.isAdmin
                      ? "bg-[#8D2676] text-white"
                      : "bg-[#3f3f46] text-[#E1E1E3]"
                  }`}
                >
                  {user.isAdmin ? "Admin" : "Member"}
                </button>
                <button
                  onClick={() => handleRemoveUser(user.userId)}
                  className="text-sm px-3 py-1.5 text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}