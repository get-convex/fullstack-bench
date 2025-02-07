"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useProjects } from "@/hooks/useProjects";
import { useGroups } from "@/hooks/useGroups";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Id } from "@/convex/_generated/dataModel";
import toast from "react-hot-toast";

interface ProjectSettingsModalProps {
  projectId: Id<"projects">;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectSettingsModal({
  projectId,
  isOpen,
  onClose,
}: ProjectSettingsModalProps) {
  const { projects, updateProject, addProjectMember, removeProjectMember, addProjectGroupMember, removeProjectGroupMember } = useProjects();
  const { groups } = useGroups();
  const { users } = useWorkspace();
  const [activeTab, setActiveTab] = useState<"general" | "members" | "groups">("general");
  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | "">("");
  const [selectedGroupId, setSelectedGroupId] = useState<Id<"groups"> | "">("");

  const project = projects?.find((p) => p._id === projectId);
  if (!project) return null;

  const handleUpdateProject = async (updates: { name?: string; description?: string; emoji?: string }) => {
    try {
      await updateProject(
        projectId,
        updates.name ?? project.name,
        updates.description ?? project.description,
        updates.emoji ?? project.emoji
      );
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
    }
  };

  const handleAddMember = async (userId: Id<"users">) => {
    try {
      await addProjectMember(projectId, userId);
      toast.success("Member added successfully");
    } catch (error) {
      toast.error("Failed to add member");
    }
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    await handleAddMember(selectedUserId);
    setSelectedUserId("");
  };

  const handleRemoveMember = async (userId: Id<"users">) => {
    try {
      await removeProjectMember(projectId, userId);
      toast.success("Member removed successfully");
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  const handleAddGroup = async (groupId: Id<"groups">) => {
    try {
      await addProjectGroupMember(projectId, groupId);
      toast.success("Group added successfully");
    } catch (error) {
      toast.error("Failed to add group");
    }
  };

  const handleAddGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId) return;
    await handleAddGroup(selectedGroupId);
    setSelectedGroupId("");
  };

  const handleRemoveGroup = async (groupId: Id<"groups">) => {
    try {
      await removeProjectGroupMember(projectId, groupId);
      toast.success("Group removed successfully");
    } catch (error) {
      toast.error("Failed to remove group");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-[#1D1D1F] p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-white mb-4">
                  Project Settings
                </Dialog.Title>

                {/* Tabs */}
                <div className="border-b border-[#26262b] mb-6">
                  <nav className="-mb-px flex space-x-6">
                    <button
                      onClick={() => setActiveTab("general")}
                      className={`pb-4 text-sm font-medium ${
                        activeTab === "general"
                          ? "text-[#8D2676] border-b-2 border-[#8D2676]"
                          : "text-[#A1A1A3] hover:text-white"
                      }`}
                    >
                      General
                    </button>
                    <button
                      onClick={() => setActiveTab("members")}
                      className={`pb-4 text-sm font-medium ${
                        activeTab === "members"
                          ? "text-[#8D2676] border-b-2 border-[#8D2676]"
                          : "text-[#A1A1A3] hover:text-white"
                      }`}
                    >
                      Members
                    </button>
                    <button
                      onClick={() => setActiveTab("groups")}
                      className={`pb-4 text-sm font-medium ${
                        activeTab === "groups"
                          ? "text-[#8D2676] border-b-2 border-[#8D2676]"
                          : "text-[#A1A1A3] hover:text-white"
                      }`}
                    >
                      Groups
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "general" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#A1A1A3] mb-2">
                        Emoji
                      </label>
                      <input
                        type="text"
                        value={project.emoji}
                        onChange={(e) => handleUpdateProject({ emoji: e.target.value })}
                        className="w-20 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#A1A1A3] mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleUpdateProject({ name: e.target.value })}
                        className="w-full bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#A1A1A3] mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={project.description}
                        onChange={(e) => handleUpdateProject({ description: e.target.value })}
                        className="w-full bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "members" && (
                  <div className="space-y-4">
                    {/* Add Member Form */}
                    <form onSubmit={handleAddMemberSubmit} className="mb-6">
                      <div className="flex gap-4">
                        <select
                          value={selectedUserId}
                          onChange={(e) => setSelectedUserId(e.target.value as Id<"users">)}
                          className="flex-1 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
                        >
                          <option value="">Select a user</option>
                          {users.map((user) => (
                            <option key={user.userId} value={user.userId}>
                              {user.email}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          disabled={!selectedUserId}
                          className="px-4 py-2 bg-[#8D2676] text-white rounded-md hover:bg-[#7D1666] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Member
                        </button>
                      </div>
                    </form>

                    {/* Members List */}
                    <div className="space-y-2">
                      {users.map((user) => (
                        <div
                          key={user.userId}
                          className="flex items-center justify-between p-3 bg-[#26262b] rounded-md"
                        >
                          <span className="text-[#E1E1E3]">{user.email}</span>
                          {project.access === "direct" ? (
                            <button
                              onClick={() => handleRemoveMember(user.userId)}
                              className="text-red-500 hover:text-red-400"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddMember(user.userId)}
                              className="text-[#8D2676] hover:text-[#7D1666]"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "groups" && (
                  <div className="space-y-4">
                    {/* Add Group Form */}
                    <form onSubmit={handleAddGroupSubmit} className="mb-6">
                      <div className="flex gap-4">
                        <select
                          value={selectedGroupId}
                          onChange={(e) => setSelectedGroupId(e.target.value as Id<"groups">)}
                          className="flex-1 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
                        >
                          <option value="">Select a group</option>
                          {groups.map((group) => (
                            <option key={group._id} value={group._id}>
                              {group.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          disabled={!selectedGroupId}
                          className="px-4 py-2 bg-[#8D2676] text-white rounded-md hover:bg-[#7D1666] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Group
                        </button>
                      </div>
                    </form>

                    {/* Groups List */}
                    <div className="space-y-2">
                      {project.accessGroups.map((group) => (
                        <div
                          key={group._id}
                          className="flex items-center justify-between p-3 bg-[#26262b] rounded-md"
                        >
                          <span className="text-[#E1E1E3]">{group.name}</span>
                          <button
                            onClick={() => handleRemoveGroup(group._id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
