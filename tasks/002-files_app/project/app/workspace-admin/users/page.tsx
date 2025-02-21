"use client";

import Link from "next/link";
import { initialUserPermissions, initialUsers } from "@/lib/exampleData";
import { Spinner } from "@/components/Spinner";

export default function UsersPage() {
  const users = initialUsers;
  const adminUsers = initialUserPermissions
    .filter((permission) => permission.isAdmin)
    .map((permission) => permission.userId);

  if (users === undefined || adminUsers === undefined) {
    return <Spinner />;
  }

  const handleUserRoleChange = async (
    userId: string,
    newRole: "member" | "admin"
  ) => {
    throw new Error("Not implemented");
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                href="/workspace-admin"
                className="text-sm text-slate-400 hover:text-slate-300"
              >
                ← Back to Workspace Admin
              </Link>
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
                  className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
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
                      className="bg-slate-800 text-slate-300 text-sm rounded-md border border-slate-700 focus:border-plum-600 focus:ring-plum-600"
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
