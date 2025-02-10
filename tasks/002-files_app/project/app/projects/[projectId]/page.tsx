"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FolderIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <div className="flex-1 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href={`/projects/${projectId}/files`}
            className="flex items-center p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <FolderIcon className="w-6 h-6 text-slate-400 mr-3" />
            <div>
              <h3 className="font-medium text-white">Files</h3>
              <p className="text-sm text-slate-400">Browse project files</p>
            </div>
          </Link>
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("openProjectSettings", {
                  detail: { tab: "members" },
                })
              )
            }
            className="flex items-center p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Cog6ToothIcon className="w-6 h-6 text-slate-400 mr-3" />
            <div className="text-left">
              <h3 className="font-medium text-white">Settings</h3>
              <p className="text-sm text-slate-400">Manage project settings</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
