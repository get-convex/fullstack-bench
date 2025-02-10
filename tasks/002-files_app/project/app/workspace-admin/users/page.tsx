"use client";

import Link from "next/link";
import { useUsers } from "@/lib/state/users";
import { setIsAdmin, useAdminUsers } from "@/lib/state/userPermissions";

export default function UsersPage() {
  const users = useUsers();
  const adminUsers = useAdminUsers();
  const handleUserRoleChange = async (
    userId: string,
    newRole: "member" | "admin"
  ) => {
    await setIsAdmin(userId, newRole === "admin");
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4">
            <Link
              href="/workspace-admin"
              className="text-sm text-slate-400 hover:text-slate-300"
            >
              ← Back to Workspace Admin
            </Link>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Users</h1>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-slate-900 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th
                  scope="col"
                  className="w-1/2 px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="w-1/2 px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                >
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={adminUsers.includes(user.id) ? "admin" : "member"}
                      onChange={(e) =>
                        handleUserRoleChange(
                          user.id,
                          e.target.value as "member" | "admin"
                        )
                      }
                      className="bg-slate-800 text-slate-300 text-sm rounded-md border border-slate-700 focus:border-plum-600 focus:ring-plum-600 px-2 py-1.5"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
