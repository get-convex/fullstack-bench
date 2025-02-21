import { Fragment, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Member, Group, User } from "@/lib/types";

interface GroupMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  addMember: (groupId: string, subject: Member["subject"]) => Promise<void>;
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

  const handleAddMember = async () => {
    console.log("handleAddMember", selectedInviteId, inviteType);
    if (!selectedInviteId) return;
    let subject: Member["subject"];
    if (inviteType === "user") {
      subject = {
        type: "user",
        userId: selectedInviteId,
      };
    } else {
      subject = {
        type: "group",
        groupId: selectedInviteId,
      };
    }
    await addMember(group.id, subject);
    setSelectedInviteId("");
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

                <div className="p-6">
                  <DialogTitle className="text-xl font-semibold text-white mb-6">
                    Add Members to {group.name}
                  </DialogTitle>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Type
                      </label>
                      <select
                        value={inviteType}
                        onChange={(e) => {
                          setInviteType(e.target.value as "user" | "group");
                          setSelectedInviteId("");
                        }}
                        className="block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-300 text-sm focus:border-plum-600 focus:ring-plum-600 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
                      >
                        <option value="user">User</option>
                        <option value="group">Group</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {inviteType === "user" ? "User" : "Group"}
                      </label>
                      <select
                        value={selectedInviteId}
                        onChange={(e) => setSelectedInviteId(e.target.value)}
                        className="block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-300 text-sm focus:border-plum-600 focus:ring-plum-600 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
                      >
                        <option value="">
                          Select {inviteType === "user" ? "a user" : "a group"}
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
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddMember}
                        disabled={!selectedInviteId}
                        className="px-4 py-2 text-sm font-medium bg-plum-600 text-white rounded-md hover:bg-plum-700 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add {inviteType === "user" ? "User" : "Group"}
                      </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
