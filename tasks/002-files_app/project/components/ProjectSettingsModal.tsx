"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
  Tab,
  TabGroup,
  TabPanel,
  TabPanels,
  TabList,
} from "@headlessui/react";
import {
  XMarkIcon,
  UserIcon,
  UserGroupIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import EmojiPicker from "./EmojiPicker";
import { Group, User } from "@/lib/types";
import { Member } from "@/lib/types";
import { Project } from "@/lib/types";

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  projectMembers: Member[];
  users: User[];
  groups: Group[];

  addMember: (subject: Member["subject"]) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  updateProjectMetadata: (
    name?: string,
    description?: string,
    emoji?: string
  ) => Promise<void>;

  initialTab?: "details" | "members" | "invite";
}

export default function ProjectSettingsModal({
  isOpen,
  onClose,
  project,
  projectMembers,
  users,
  groups,
  addMember,
  removeMember,
  updateProjectMetadata,
  initialTab = "details",
}: ProjectSettingsModalProps) {
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});
  const [inviteType, setInviteType] = useState<"user" | "group">("user");
  const [selectedInviteId, setSelectedInviteId] = useState("");

  console.log("projectMembers", projectMembers);

  const handleSave = () => {
    updateProjectMetadata(
      editedProject.name,
      editedProject.description,
      editedProject.emoji
    );
    onClose();
  };

  const handleInvite = () => {
    const subject =
      inviteType === "user"
        ? { type: "user" as const, userId: selectedInviteId }
        : { type: "group" as const, groupId: selectedInviteId };
    addMember(subject);
    setSelectedInviteId("");
    setSelectedTab("members");
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-visible rounded-lg bg-slate-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-slate-400 hover:text-slate-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <TabGroup
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
                  <div className="border-b border-slate-700">
                    <TabList className="flex px-6">
                      <Tab
                        className={({ selected }) =>
                          clsx(
                            "px-4 py-3 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap",
                            selected
                              ? "border-plum-600 text-slate-200"
                              : "border-transparent text-slate-400 hover:text-slate-200"
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
                              ? "border-plum-600 text-slate-200"
                              : "border-transparent text-slate-400 hover:text-slate-200"
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
                              ? "border-plum-600 text-slate-200"
                              : "border-transparent text-slate-400 hover:text-slate-200"
                          )
                        }
                      >
                        Invite
                      </Tab>
                    </TabList>
                  </div>

                  <TabPanels className="px-6 py-4">
                    <TabPanel>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <EmojiPicker
                            emoji={editedProject.emoji ?? project.emoji}
                            onEmojiSelect={(emoji) =>
                              setEditedProject((prev) => ({
                                ...prev,
                                emoji,
                              }))
                            }
                          />
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={editedProject.name ?? project.name}
                              onChange={(e) =>
                                setEditedProject((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="w-full bg-slate-800 text-slate-200 rounded-md border border-slate-700 focus:border-plum-600 focus:ring-1 focus:ring-plum-600 px-3 py-2 shadow-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={
                              editedProject.description ?? project.description
                            }
                            onChange={(e) =>
                              setEditedProject((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows={3}
                            className="w-full bg-slate-800 text-slate-200 rounded-md border border-slate-700 focus:border-plum-600 focus:ring-1 focus:ring-plum-600 px-3 py-2 shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSave}
                          className="px-4 py-2 text-sm font-medium text-white bg-plum-600 rounded-md hover:bg-plum-700 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save Changes
                        </button>
                      </div>
                    </TabPanel>

                    <TabPanel>
                      <div className="space-y-3">
                        {projectMembers.map((member) => (
                          <ProjectMemberRow
                            key={member.id}
                            member={member}
                            users={users}
                            groups={groups}
                            handleRemoveMember={removeMember}
                          />
                        ))}
                      </div>
                    </TabPanel>

                    <TabPanel>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">
                            Type
                          </label>
                          <select
                            value={inviteType}
                            onChange={(e) => {
                              setInviteType(e.target.value as "user" | "group");
                              setSelectedInviteId("");
                            }}
                            className="block w-full rounded-md border-slate-700 bg-slate-800 text-white shadow-sm focus:border-plum-600 focus:ring-plum-600 sm:text-sm"
                          >
                            <option value="user">User</option>
                            <option value="group">Group</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">
                            {inviteType === "user" ? "User" : "Group"}
                          </label>
                          <select
                            value={selectedInviteId}
                            onChange={(e) =>
                              setSelectedInviteId(e.target.value)
                            }
                            className="block w-full rounded-md border-slate-700 bg-slate-800 text-white shadow-sm focus:border-plum-600 focus:ring-plum-600 sm:text-sm"
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
                        <div className="mt-6">
                          <button
                            onClick={handleInvite}
                            disabled={!selectedInviteId}
                            className="w-full rounded-md bg-plum-600 px-3 py-2 text-sm text-white hover:bg-plum-700 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add {inviteType === "user" ? "User" : "Group"}
                          </button>
                        </div>
                      </div>
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function ProjectMemberRow({
  member,
  users,
  groups,
  handleRemoveMember,
}: {
  member: Member;
  users: User[];
  groups: Group[];
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
          <UserIcon className="h-5 w-5 text-slate-400" />
        ) : (
          <UserGroupIcon className="h-5 w-5 text-slate-400" />
        )}
        <div className="ml-3 min-w-0">
          <p className="text-sm text-slate-500 truncate">{name}</p>
        </div>
      </div>
      <div className="ml-3 flex items-center space-x-3">
        <button
          onClick={() => handleRemoveMember(member.id)}
          className="text-slate-400 hover:text-red-600"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
