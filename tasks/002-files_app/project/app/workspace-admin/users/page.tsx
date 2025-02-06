"use client";

import { useState } from "react";
import { updateUserRole, useUsers, inviteUser, removeUser } from "@/testData";
import { UserPlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import InviteUserModal from "@/components/InviteUserModal";
import Link from "next/link";

export default function UsersPage() {
  const users = useUsers();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleUserRoleChange = (userId: string, newRole: "member" | "admin") => {
    updateUserRole(userId, newRole === "admin");
  };

  const handleInviteUser = (email: string) => {
    inviteUser(email);
    setShowInviteModal(false);
  };

  const handleRemoveUser = (userId: string) => {
    removeUser(userId);
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
              <h1 className="text-2xl font-bold text-white">
                Users
              </h1>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#8D2676] hover:bg-[#7A2065] rounded-md transition-colors"
            >
              <UserPlusIcon className="w-4 h-4 mr-1.5" />
              Invite User
            </button>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-[#161B22] rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-[#1C2128]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={user.isAdmin ? "admin" : "member"}
                      onChange={(e) => handleUserRoleChange(user.id, e.target.value as "member" | "admin")}
                      className="bg-[#1C2128] text-gray-300 text-sm rounded-md border border-gray-700 focus:border-[#8D2676] focus:ring-[#8D2676]"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="text-gray-400 hover:text-red-400"
                      title="Remove User"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInviteUser={handleInviteUser}
      />
    </div>
  );
}