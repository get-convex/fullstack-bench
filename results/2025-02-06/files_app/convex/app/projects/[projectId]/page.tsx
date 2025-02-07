"use client";

import { useProjects } from "@/hooks/useProjects";
import { useFilesystem } from "@/hooks/useFilesystem";
import { useUser } from "@/components/UserContext";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const { userId, isLoading: userLoading } = useUser();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { rootEntries, isLoading: filesLoading, createEntry } = useFilesystem(projectId as Id<"projects">);
  const [newFileName, setNewFileName] = useState("");

  // Wait for user and projects to load
  if (userLoading || projectsLoading) {
    return (
      <div className="p-6">
        <div className="h-32 bg-[#26262b] rounded-md animate-pulse"></div>
      </div>
    );
  }

  // Check if user is logged in
  if (!userId) {
    router.push("/");
    return null;
  }

  // Check if projects have loaded
  if (!projects) {
    return (
      <div className="p-6">
        <div className="h-32 bg-[#26262b] rounded-md animate-pulse"></div>
      </div>
    );
  }

  // Check if project exists and user has access
  const project = projects.find(p => p._id === projectId);
  if (!project) {
    return (
      <div className="p-6">
        <div className="text-red-500">Project not found or access denied</div>
      </div>
    );
  }

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;

    try {
      await createEntry(undefined, newFileName, "file", "");
      setNewFileName("");
      toast.success("File created successfully");
    } catch (error) {
      toast.error("Failed to create file");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{project.emoji}</span>
          <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
        </div>
        <p className="text-[#A1A1A3]">{project.description}</p>
      </div>

      {/* Create File Form */}
      <form onSubmit={handleCreateFile} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Enter file name"
            className="flex-1 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#8D2676] text-white rounded-md hover:bg-[#7D1666] transition-colors"
          >
            Create File
          </button>
        </div>
      </form>

      {/* Files List */}
      {filesLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 bg-[#26262b] rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {rootEntries?.map((entry) => (
            <div
              key={entry._id}
              className="flex items-center justify-between p-3 bg-[#26262b] rounded-md"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {entry.type === "directory" ? "📁" : "📄"}
                </span>
                <span className="text-[#E1E1E3]">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#A1A1A3]">{entry.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
