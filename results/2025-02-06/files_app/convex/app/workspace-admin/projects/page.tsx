"use client";

import { useProjects } from "@/hooks/useProjects";
import { useUser } from "@/components/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function ProjectsPage() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    emoji: "📁",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!isAdmin) {
    router.push("/");
    return null;
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;

    try {
      await createProject(newProject.name, newProject.description, newProject.emoji);
      setNewProject({ name: "", description: "", emoji: "📁" });
      toast.success("Project created successfully");
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  const handleDeleteProject = async (projectId: Id<"projects">) => {
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-6">Projects</h1>

      {/* Create Project Form */}
      <form onSubmit={handleCreateProject} className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-20 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
            >
              {newProject.emoji}
            </button>
            {showEmojiPicker && (
              <div className="absolute z-10 mt-2">
                <Picker
                  data={data}
                  onEmojiSelect={(emoji: { native: string }) => {
                    setNewProject(prev => ({ ...prev, emoji: emoji.native }));
                    setShowEmojiPicker(false);
                  }}
                  theme="dark"
                />
              </div>
            )}
          </div>
          <input
            type="text"
            value={newProject.name}
            onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Project name"
            className="flex-1 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
          />
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            value={newProject.description}
            onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Project description"
            className="flex-1 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#8D2676] text-white rounded-md hover:bg-[#7D1666] transition-colors"
          >
            Create Project
          </button>
        </div>
      </form>

      {/* Projects List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-[#26262b] rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex items-start justify-between p-4 bg-[#26262b] rounded-md"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{project.emoji}</span>
                  <h3 className="text-lg font-medium text-white">{project.name}</h3>
                </div>
                <p className="text-[#A1A1A3]">{project.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
