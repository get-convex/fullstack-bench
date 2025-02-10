"use client";

import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Group, Project, User } from "@/lib/types";

interface SidebarProps {
  user?: User;
  isAdmin: boolean;
  projects: Project[];
  groups: Group[];
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div className="w-64 bg-[#0D1117] border-r border-gray-800 p-4 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Projects</h2>
        <div className="flex space-x-2">
          <Link href="/" className="text-sm text-blue-400 hover:text-blue-300">
            Home
          </Link>
          {props.isAdmin && (
            <Link
              href="/workspace-admin"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        {props.projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block p-2 rounded hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span>{project.emoji}</span>
              <span className="font-medium text-gray-200">{project.name}</span>
            </div>
            <p className="text-sm text-gray-400 ml-6">{project.description}</p>
          </Link>
        ))}
      </div>

      {/* Groups Section */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Groups</h3>
        <div className="space-y-1">
          {props.groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="block px-2 py-1.5 text-sm text-gray-400 hover:bg-gray-800/50 hover:text-gray-300 rounded"
            >
              {group.name}
            </Link>
          ))}
        </div>
      </div>

      {/* User Section */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <UserCircleIcon className="w-8 h-8 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p
              className="text-sm text-gray-300 truncate"
              title={props.user?.email ?? ""}
            >
              {props.user?.email ?? ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
