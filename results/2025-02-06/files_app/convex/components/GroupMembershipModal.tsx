"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useGroups } from "@/hooks/useGroups";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";

interface GroupMembershipModalProps {
  groupId: Id<"groups">;
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupMembershipModal({
  groupId,
  isOpen,
  onClose,
}: GroupMembershipModalProps) {
  const { groups } = useGroups();
  const { users } = useWorkspace();
  const groupMembers = useQuery(api.queries.getGroupMembers, { groupId });
  const group = groups?.find((g) => g._id === groupId);

  if (!group || !groupMembers) return null;

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
                  {group.name} - Group Members
                </Dialog.Title>

                {/* Parent Group */}
                {groupMembers.parentGroup && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-[#A1A1A3] mb-2">
                      Parent Group
                    </h3>
                    <div className="p-3 bg-[#26262b] rounded-md">
                      <span className="text-[#E1E1E3]">
                        {groupMembers.parentGroup.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Direct Members */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#A1A1A3] mb-2">
                    Direct Members
                  </h3>
                  <div className="space-y-2">
                    {groupMembers.directMembers.map((userId) => {
                      const user = users.find((u) => u.userId === userId);
                      return (
                        <div
                          key={userId}
                          className="flex items-center justify-between p-3 bg-[#26262b] rounded-md"
                        >
                          <span className="text-[#E1E1E3]">{userId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Child Groups */}
                <div>
                  <h3 className="text-sm font-medium text-[#A1A1A3] mb-2">
                    Child Groups
                  </h3>
                  <div className="space-y-2">
                    {groupMembers.childGroups.map((childGroup) => (
                      <div
                        key={childGroup._id}
                        className="flex items-center justify-between p-3 bg-[#26262b] rounded-md"
                      >
                        <span className="text-[#E1E1E3]">{childGroup.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
