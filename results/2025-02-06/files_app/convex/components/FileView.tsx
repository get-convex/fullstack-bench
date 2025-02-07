"use client";

import { useFilesystem } from "@/hooks/useFilesystem";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface FileViewProps {
  projectId: Id<"projects">;
  fileId: Id<"filesystem_entries">;
}

export default function FileView({ projectId, fileId }: FileViewProps) {
  const { updateEntry } = useFilesystem(projectId);
  const file = useQuery(api.filesystem.getFile, { projectId, fileId });
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (file) {
      setContent(file.content);
    }
  }, [file]);

  const handleSave = async () => {
    try {
      await updateEntry(fileId, { content });
      setIsEditing(false);
      toast.success("File saved successfully");
    } catch (error) {
      toast.error("Failed to save file");
    }
  };

  if (!file) {
    return (
      <div className="p-4">
        <div className="h-96 bg-[#26262b] rounded-md animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📄</span>
          <h2 className="text-lg font-medium text-white">{file.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-[#8D2676] text-white rounded-md hover:bg-[#7D1666] transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setContent(file.content);
                }}
                className="px-3 py-1.5 bg-[#3f3f46] text-white rounded-md hover:bg-[#52525b] transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 bg-[#3f3f46] text-white rounded-md hover:bg-[#52525b] transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-96 bg-[#26262b] text-white px-4 py-3 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676] font-mono"
        />
      ) : (
        <pre className="w-full h-96 bg-[#26262b] text-white px-4 py-3 rounded-md border border-[#3f3f46] overflow-auto font-mono">
          {content}
        </pre>
      )}
    </div>
  );
}
