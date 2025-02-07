"use client";

import { useRouter } from "next/navigation";
import { useFilesystem } from "@/hooks/useFilesystem";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

interface DirectoryViewProps {
  projectId: Id<"projects">;
  parentId?: Id<"filesystem_entries">;
}

export default function DirectoryView({ projectId, parentId }: DirectoryViewProps) {
  const router = useRouter();
  const { createEntry, deleteEntry } = useFilesystem(projectId);
  const [newEntryName, setNewEntryName] = useState("");
  const [newEntryType, setNewEntryType] = useState<"file" | "directory">("file");
  const entries = useFilesystem(projectId).listDirectory(parentId);

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryName) return;

    try {
      await createEntry(parentId, newEntryName, newEntryType, newEntryType === "file" ? "" : undefined);
      setNewEntryName("");
      toast.success(`${newEntryType} created successfully`);
    } catch (error) {
      toast.error(`Failed to create ${newEntryType}`);
    }
  };

  const handleDeleteEntry = async (entryId: Id<"filesystem_entries">) => {
    try {
      await deleteEntry(entryId);
      toast.success("Entry deleted successfully");
    } catch (error) {
      toast.error("Failed to delete entry");
    }
  };

  if (!entries) {
    return (
      <div className="p-4">
        <div className="h-32 bg-[#26262b] rounded-md animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Create Entry Form */}
      <form onSubmit={handleCreateEntry} className="mb-6">
        <div className="flex gap-4">
          <select
            value={newEntryType}
            onChange={(e) => setNewEntryType(e.target.value as "file" | "directory")}
            className="bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
          >
            <option value="file">File</option>
            <option value="directory">Directory</option>
          </select>
          <input
            type="text"
            value={newEntryName}
            onChange={(e) => setNewEntryName(e.target.value)}
            placeholder={`Enter ${newEntryType} name`}
            className="flex-1 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#8D2676] text-white rounded-md hover:bg-[#7D1666] transition-colors"
          >
            Create
          </button>
        </div>
      </form>

      {/* Entries List */}
      <div className="space-y-2">
        {entries.map((entry) => (
          <Link
            key={entry._id}
            href={`/projects/${projectId}/files${entry.fullPath}`}
            className="block"
          >
            <div className="flex items-center justify-between p-3 bg-[#26262b] rounded-md hover:bg-[#2f2f35] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {entry.type === "directory" ? "📁" : "📄"}
                </span>
                <span className="text-[#E1E1E3]">{entry.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#A1A1A3]">{entry.type}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteEntry(entry._id);
                  }}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
