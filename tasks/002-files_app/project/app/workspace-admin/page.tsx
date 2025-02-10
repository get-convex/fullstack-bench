"use client";

import Link from "next/link";
import {
  UserIcon,
  UserGroupIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";

export default function WorkspaceAdminPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Workspace Administration
          </h1>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/workspace-admin/users"
            className="flex items-center p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <UserIcon className="w-8 h-8 text-slate-400 mr-5" />
            <div>
              <h3 className="font-medium text-white">Users</h3>
              <p className="text-sm text-slate-400">
                Manage workspace users and permissions
              </p>
            </div>
          </Link>
          <Link
            href="/workspace-admin/groups"
            className="flex items-center p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <UserGroupIcon className="w-8 h-8 text-slate-400 mr-5" />
            <div>
              <h3 className="font-medium text-white">Groups</h3>
              <p className="text-sm text-slate-400">
                Manage workspace groups and memberships
              </p>
            </div>
          </Link>
          <Link
            href="/workspace-admin/projects"
            className="flex items-center p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <FolderIcon className="w-8 h-8 text-slate-400 mr-5" />
            <div>
              <h3 className="font-medium text-white">Projects</h3>
              <p className="text-sm text-slate-400">
                Manage workspace projects and settings
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
