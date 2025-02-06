"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import {
  XMarkIcon,
  PlusIcon,
  UserIcon,
  UserGroupIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import type { Project, Member, Group, User } from "../testData";

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  projectMembers: Member[];
  users: User[];
  groups: Group[];

  addMemberToProject: (projectId: string, member: Member) => void;
  removeMemberFromProject: (projectId: string, memberId: string) => void;
  updateProjectMemberRole: (
    projectId: string,
    memberId: string,
    role: Member["role"]
  ) => void;

  initialTab?: "details" | "members" | "invite";
}

export default function ProjectSettingsModal({
  isOpen,
  onClose,
  project,
  projectMembers,
  users,
  groups,
  addMemberToProject,
  removeMemberFromProject,
  updateProjectMemberRole,
  initialTab = "details",
}: ProjectSettingsModalProps) {
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [editedProject, setEditedProject] = useState(project);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inviteType, setInviteType] = useState<"user" | "group">("user");
  const [selectedInviteId, setSelectedInviteId] = useState("");
  const [inviteRole, setInviteRole] = useState<Member["role"]>("member");

  const handleSave = () => {
    // onUpdateProject(editedProject);
    onClose();
  };

  const handleInvite = () => {
    const subject =
      inviteType === "user"
        ? users.find((u) => u.id === selectedInviteId)
        : groups.find((g) => g.id === selectedInviteId);

    if (!subject) return;

    const newMember: Member = {
      id: crypto.randomUUID(),
      subject:
        inviteType === "user"
          ? {
              type: "user",
              userId: subject.id,
            }
          : {
              type: "group",
              groupId: subject.id,
            },
      role: inviteRole,
    };
    addMemberToProject(project.id, newMember);
    setSelectedInviteId("");
    setInviteRole("member");
  };

  const handleRoleChange = (memberId: string, newRole: Member["role"]) => {
    updateProjectMemberRole(project.id, memberId, newRole);
  };

  const handleRemoveMember = (memberId: string) => {
    removeMemberFromProject(project.id, memberId);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-[#1C1C1F] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <Tab.Group
                  selectedIndex={
                    selectedTab === "details"
                      ? 0
                      : selectedTab === "members"
                      ? 1
                      : 2
                  }
                  onChange={(index) =>
                    setSelectedTab(
                      index === 0
                        ? "details"
                        : index === 1
                        ? "members"
                        : "invite"
                    )
                  }
                >
                  <div className="border-b border-gray-800">
                    <Tab.List className="flex px-6">
                      <Tab
                        className={({ selected }) =>
                          clsx(
                            "px-4 py-3 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap",
                            selected
                              ? "border-[#8D2676] text-[#E1E1E3]"
                              : "border-transparent text-gray-400 hover:text-gray-200"
                          )
                        }
                      >
                        Project Details
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          clsx(
                            "px-4 py-3 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap",
                            selected
                              ? "border-[#8D2676] text-[#E1E1E3]"
                              : "border-transparent text-gray-400 hover:text-gray-200"
                          )
                        }
                      >
                        Members
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          clsx(
                            "px-4 py-3 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap",
                            selected
                              ? "border-[#8D2676] text-[#E1E1E3]"
                              : "border-transparent text-gray-400 hover:text-gray-200"
                          )
                        }
                      >
                        Invite
                      </Tab>
                    </Tab.List>
                  </div>

                  <Tab.Panels className="px-6 py-4">
                    <Tab.Panel>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setShowEmojiPicker(!showEmojiPicker)
                              }
                              className="inline-flex items-center justify-center w-10 h-10 text-2xl bg-[#26262B] border border-gray-700 rounded-md hover:bg-[#2C2C31] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8D2676]"
                            >
                              {editedProject.emoji}
                            </button>
                            {showEmojiPicker && (
                              <div
                                className="absolute z-[100] mt-1"
                                style={{
                                  minWidth: "352px",
                                  position: "fixed",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                }}
                              >
                                <div className="bg-[#1C1C1F] rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
                                  <Picker
                                    data={data}
                                    onEmojiSelect={(emoji: any) => {
                                      setEditedProject((prev) => ({
                                        ...prev,
                                        emoji: emoji.native,
                                      }));
                                      setShowEmojiPicker(false);
                                    }}
                                    theme="dark"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={editedProject.name}
                              onChange={(e) =>
                                setEditedProject((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="block w-full rounded-md border-gray-700 bg-[#26262B] text-white shadow-sm focus:border-[#8D2676] focus:ring-[#8D2676] sm:text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={editedProject.description}
                            onChange={(e) =>
                              setEditedProject((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows={3}
                            className="block w-full rounded-md border-gray-700 bg-[#26262B] text-white shadow-sm focus:border-[#8D2676] focus:ring-[#8D2676] sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSave}
                          className="rounded-md bg-[#8D2676] px-3 py-2 text-sm text-white hover:bg-[#7A2065] focus:outline-none focus:ring-2 focus:ring-[#8D2676] focus:ring-offset-2"
                        >
                          Save Changes
                        </button>
                      </div>
                    </Tab.Panel>

                    <Tab.Panel>
                      <div className="space-y-3">
                        {projectMembers.map((member) => (
                          <ProjectMemberRow
                            key={member.id}
                            member={member}
                            users={users}
                            groups={groups}
                            handleRoleChange={handleRoleChange}
                            handleRemoveMember={handleRemoveMember}
                          />
                        ))}
                      </div>
                    </Tab.Panel>

                    <Tab.Panel>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Type
                          </label>
                          <select
                            value={inviteType}
                            onChange={(e) => {
                              setInviteType(e.target.value as "user" | "group");
                              setSelectedInviteId("");
                            }}
                            className="block w-full rounded-md border-gray-700 bg-[#26262B] text-white shadow-sm focus:border-[#8D2676] focus:ring-[#8D2676] sm:text-sm"
                          >
                            <option value="user">User</option>
                            <option value="group">Group</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            {inviteType === "user" ? "User" : "Group"}
                          </label>
                          <select
                            value={selectedInviteId}
                            onChange={(e) =>
                              setSelectedInviteId(e.target.value)
                            }
                            className="block w-full rounded-md border-gray-700 bg-[#26262B] text-white shadow-sm focus:border-[#8D2676] focus:ring-[#8D2676] sm:text-sm"
                          >
                            <option value="">
                              Select{" "}
                              {inviteType === "user" ? "a user" : "a group"}
                            </option>
                            {inviteType === "user"
                              ? users.map((user) => (
                                  <option key={user.id} value={user.id}>
                                    {user.email}
                                  </option>
                                ))
                              : groups.map((group) => (
                                  <option key={group.id} value={group.id}>
                                    {group.name}
                                  </option>
                                ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Role
                          </label>
                          <select
                            value={inviteRole}
                            onChange={(e) =>
                              setInviteRole(e.target.value as Member["role"])
                            }
                            className="block w-full rounded-md border-gray-700 bg-[#26262B] text-white shadow-sm focus:border-[#8D2676] focus:ring-[#8D2676] sm:text-sm"
                          >
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                          </select>
                        </div>
                        <div className="mt-6">
                          <button
                            onClick={handleInvite}
                            disabled={!selectedInviteId}
                            className="w-full rounded-md bg-[#8D2676] px-3 py-2 text-sm text-white hover:bg-[#7A2065] focus:outline-none focus:ring-2 focus:ring-[#8D2676] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add {inviteType === "user" ? "User" : "Group"}
                          </button>
                        </div>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function ProjectMemberRow({
  member,
  users,
  groups,
  handleRoleChange,
  handleRemoveMember,
}: {
  member: Member;
  users: User[];
  groups: Group[];
  handleRoleChange: (memberId: string, newRole: Member["role"]) => void;
  handleRemoveMember: (memberId: string) => void;
}) {
  let name: string;
  if (member.subject.type === "user") {
    const userId = member.subject.userId;
    name = users.find((u) => u.id === userId)?.email || "";
  } else {
    const groupId = member.subject.groupId;
    name = groups.find((g) => g.id === groupId)?.name || "";
  }
  return (
    <div key={member.id} className="flex items-center justify-between py-2">
      <div className="flex items-center min-w-0">
        {member.subject.type === "user" ? (
          <UserIcon className="h-5 w-5 text-gray-400" />
        ) : (
          <UserGroupIcon className="h-5 w-5 text-gray-400" />
        )}
        <div className="ml-3 min-w-0">
          <p className="text-sm text-gray-500 truncate">{name}</p>
        </div>
      </div>
      <div className="ml-3 flex items-center space-x-3">
        <select
          value={member.role}
          onChange={(e) =>
            handleRoleChange(member.id, e.target.value as Member["role"])
          }
          disabled={member.role === "owner"}
          className="block rounded-md border-gray-700 bg-[#26262B] text-sm text-white shadow-sm focus:border-[#8D2676] focus:ring-[#8D2676] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
        {member.role !== "owner" && (
          <button
            onClick={() => handleRemoveMember(member.id)}
            className="text-gray-400 hover:text-red-600"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
