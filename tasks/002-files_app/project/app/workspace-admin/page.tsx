"use client";

import Link from "next/link";
import { UserIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function WorkspaceAdminPage() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Workspace Administration
          </h1>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/workspace-admin/users"
            className="flex items-center p-4 bg-[#161B22] rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <UserIcon className="w-6 h-6 text-gray-400 mr-3" />
            <div>
              <h3 className="font-medium text-white">
                Users
              </h3>
              <p className="text-sm text-gray-400">
                Manage workspace users and permissions
              </p>
            </div>
          </Link>
          <Link
            href="/workspace-admin/groups"
            className="flex items-center p-4 bg-[#161B22] rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <UserGroupIcon className="w-6 h-6 text-gray-400 mr-3" />
            <div>
              <h3 className="font-medium text-white">
                Groups
              </h3>
              <p className="text-sm text-gray-400">
                Manage workspace groups and memberships
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
