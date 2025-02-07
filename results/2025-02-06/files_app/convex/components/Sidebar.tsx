"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "./UserContext";
import { useProjects } from "@/hooks/useProjects";
import { LogoutButton } from "./LogoutButton";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useUser();
  const { projects, isLoading } = useProjects();

  return (
    <div className="w-64 bg-[#1D1D1F] border-r border-[#26262b] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#26262b]">
        <h1 className="text-lg font-medium text-white">Files Workspace</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-sm font-medium text-[#A1A1A3] mb-2">Projects</h2>
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 bg-[#26262b] rounded animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              {projects.map((project) => (
                <li key={project._id}>
                  <Link
                    href={`/projects/${project._id}`}
                    className={clsx(
                      "flex items-center px-2 py-1.5 text-sm rounded-md",
                      pathname === `/projects/${project._id}`
                        ? "bg-[#8D2676] text-white"
                        : "text-[#E1E1E3] hover:bg-[#26262b]"
                    )}
                  >
                    <span className="mr-2">{project.emoji}</span>
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Admin Navigation */}
        {isAdmin && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-[#A1A1A3] mb-2">Admin</h2>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/workspace-admin"
                  className={clsx(
                    "block px-2 py-1.5 text-sm rounded-md",
                    pathname === "/workspace-admin"
                      ? "bg-[#8D2676] text-white"
                      : "text-[#E1E1E3] hover:bg-[#26262b]"
                  )}
                >
                  Workspace Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/workspace-admin/users"
                  className={clsx(
                    "block px-2 py-1.5 text-sm rounded-md",
                    pathname === "/workspace-admin/users"
                      ? "bg-[#8D2676] text-white"
                      : "text-[#E1E1E3] hover:bg-[#26262b]"
                  )}
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  href="/workspace-admin/groups"
                  className={clsx(
                    "block px-2 py-1.5 text-sm rounded-md",
                    pathname === "/workspace-admin/groups"
                      ? "bg-[#8D2676] text-white"
                      : "text-[#E1E1E3] hover:bg-[#26262b]"
                  )}
                >
                  Groups
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#26262b]">
        <LogoutButton />
      </div>
    </div>
  );
}
