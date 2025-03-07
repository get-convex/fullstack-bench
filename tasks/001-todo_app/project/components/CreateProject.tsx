"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";

interface CreateProjectProps {
  userId: string;
  createProject: (
    name: string,
    emoji: string,
    description: string,
    creatorId: string
  ) => void;
  setIsCreatingProject: (isCreating: boolean) => void;
}

export function CreateProject({
  userId,
  createProject,
  setIsCreatingProject,
}: CreateProjectProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📋");
  const [description, setDescription] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    void createProject(name.trim(), emoji, description.trim(), userId);
    setIsCreatingProject(false);
  };

  return (
    <Modal
      open={true}
      onOpenChange={(open) => !open && setIsCreatingProject(false)}
      title="Create Project"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="shrink-0 w-10 h-10 bg-slate-900 text-slate-200 text-lg rounded hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-700 transition-colors flex items-center justify-center"
            >
              {emoji || <Smile className="text-slate-400" size={20} />}
            </button>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="flex-1 px-2 py-1.5 bg-slate-900 text-slate-200 text-sm rounded placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-700 transition-colors"
              autoFocus
            />
          </div>
          {showEmojiPicker && (
            <div className="absolute z-50 mt-1">
              <Picker
                data={data}
                onEmojiSelect={(emoji: { native: string }) => {
                  setEmoji(emoji.native);
                  setShowEmojiPicker(false);
                }}
                theme="dark"
              />
            </div>
          )}
        </div>
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-2 py-1.5 bg-slate-900 text-slate-200 text-sm rounded placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-700 transition-colors resize-none"
            rows={3}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsCreatingProject(false)}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-700 text-white text-xs rounded hover:bg-slate-600 transition-colors"
          >
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  );
}
