import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Member, User, Group } from "../testData";

interface GroupMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  addMember: (groupId: string, member: Member) => void;
  users: User[];
  groups: Group[];
}

export default function GroupMembershipModal({
  isOpen,
  onClose,
  group,
  addMember,
  users,
  groups,
}: GroupMembershipModalProps) {
  const [inviteType, setInviteType] = useState<"user" | "group">("user");
  const [selectedInviteId, setSelectedInviteId] = useState("");

  const handleAddMember = () => {
    if (!selectedInviteId) return;
    let newMember: Member;
    if (inviteType === "user") {
      newMember = {
        id: selectedInviteId,
        subject: {
          type: "user",
          userId: selectedInviteId,
        },
        role: "member",
      };
    } else {
      newMember = {
        id: selectedInviteId,
        subject: {
          type: "group",
          groupId: selectedInviteId,
        },
        role: "member",
      };
    }
    addMember(group.id, newMember);
    setSelectedInviteId("");
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

                <div className="px-6 py-4">
                  <Dialog.Title className="text-lg font-medium text-white mb-4">
                    Add Members to {group.name}
                  </Dialog.Title>

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
                        onChange={(e) => setSelectedInviteId(e.target.value)}
                        className="block w-full rounded-md border-gray-700 bg-[#26262B] text-white shadow-sm focus:border-[#8D2676] focus:ring-[#8D2676] sm:text-sm"
                      >
                        <option value="">Select {inviteType === "user" ? "a user" : "a group"}</option>
                        {inviteType === "user"
                          ? users
                              .map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.email}
                                </option>
                              ))
                          : groups
                              .map((group) => (
                                <option key={group.id} value={group.id}>
                                  {group.name}
                                </option>
                              ))}
                      </select>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleAddMember}
                        disabled={!selectedInviteId}
                        className="w-full rounded-md bg-[#8D2676] px-3 py-2 text-sm text-white hover:bg-[#7A2065] focus:outline-none focus:ring-2 focus:ring-[#8D2676] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add {inviteType === "user" ? "User" : "Group"}
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}