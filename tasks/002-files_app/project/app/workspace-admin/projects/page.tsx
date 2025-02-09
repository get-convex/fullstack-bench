"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import EmojiPicker from "@/components/EmojiPicker";
import { useProjects } from "@/lib/state/projects";
import { addProject, deleteProject } from "@/lib/state/projects";
import { useUserEmail } from "@/components/WithUserEmail";
import { useUserByEmail } from "@/lib/state/users";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string, description: string, emoji: string) => void;
}

function CreateProjectModal({
  isOpen,
  onClose,
  onCreateProject,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("📁");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateProject(name, description, emoji);
    setName("");
    setDescription("");
    setEmoji("📁");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0D1117] rounded-lg p-6 w-full max-w-md border border-[#30363D] shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6">
          Create New Project
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="flex items-start space-x">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Emoji
                </label>
                <EmojiPicker emoji={emoji} onEmojiSelect={setEmoji} />
              </div>
              <div className="flex-1 ml-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#161B22] text-gray-200 rounded-md border border-[#30363D] focus:border-[#8D2676] focus:ring-1 focus:ring-[#8D2676] px-3 py-2 shadow-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#161B22] text-gray-200 rounded-md border border-[#30363D] focus:border-[#8D2676] focus:ring-1 focus:ring-[#8D2676] px-3 py-2 shadow-sm"
                rows={3}
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-[#21262D] hover:bg-[#30363D] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#8D2676] hover:bg-[#7A2065] rounded-md transition-colors shadow-sm"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const projects = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const email = useUserEmail();
  const user = useUserByEmail(email)!;

  const handleCreateProject = async (
    name: string,
    description: string,
    emoji: string
  ) => {
    await addProject(user.id, name, description, emoji);
    setShowCreateModal(false);
  };

  const handleDeleteProject = (projectId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      deleteProject(user.id, projectId);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                href="/workspace-admin"
                className="text-sm text-gray-400 hover:text-gray-300"
              >
                ← Back to Workspace Admin
              </Link>
              <h1 className="text-2xl font-bold text-white">Projects</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#8D2676] hover:bg-[#7A2065] rounded-md transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1.5" />
              New Project
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-[#161B22] rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-[#1C2128]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Project
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{project.emoji}</span>
                      <span className="text-sm text-gray-300">
                        {project.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">
                      {project.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-gray-400 hover:text-red-400"
                      title="Delete Project"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
