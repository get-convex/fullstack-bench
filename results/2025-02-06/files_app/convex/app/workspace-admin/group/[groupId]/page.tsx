"use client";

import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  UserIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import GroupMembershipModal from "@/components/GroupMembershipModal";
import Link from "next/link";

interface ChildGroup {
  _id: Id<"groups">;
  name: string;
}

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as Id<"groups">;
  const group = useQuery(api.groups.getGroup, { groupId });
  const groupMembers = useQuery(api.queries.getGroupMembers, { groupId });
  const updateGroup = useMutation(api.groups.updateGroup);
  const deleteGroup = useMutation(api.groups.deleteGroup);
  const removeGroupMember = useMutation(api.groups.removeGroupMember);

  if (!group) {
    notFound();
  }

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(group.name);
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  const handleUpdateName = async () => {
    if (!editedName.trim()) return;
    await updateGroup({ groupId, name: editedName.trim() });
    setIsEditingName(false);
  };

  const handleDeleteGroup = async () => {
    await deleteGroup({ groupId });
    router.push("/workspace-admin/groups");
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/workspace-admin/groups"
                className="text-sm text-gray-400 hover:text-gray-300"
              >
                ← Back to Groups
              </Link>
              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-[#1C2128] border-gray-700 rounded-md text-gray-300 text-xl font-bold focus:border-[#8D2676] focus:ring-[#8D2676]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateName();
                      if (e.key === "Escape") {
                        setIsEditingName(false);
                        setEditedName(group.name);
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setEditedName(group.name);
                    }}
                    className="text-sm text-gray-400 hover:text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <span>{group.name}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-gray-400 hover:text-gray-300"
                    title="Rename Group"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </h1>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMembershipModal(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#8D2676] hover:bg-[#7A2065] rounded-md transition-colors"
              >
                <UserPlusIcon className="w-4 h-4 mr-1.5" />
                Add Members
              </button>
              <button
                onClick={handleDeleteGroup}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-500 hover:text-red-400"
              >
                <TrashIcon className="w-4 h-4 mr-1.5" />
                Delete Group
              </button>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-[#161B22] rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-medium text-white">Members</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {group.members.map((userId) => (
              <div
                key={userId}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{userId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeGroupMember({ groupId, userId })}
                    className="text-gray-400 hover:text-red-400 ml-4"
                    title="Remove Member"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {groupMembers?.childGroups.map((childGroup: ChildGroup) => (
              <div
                key={childGroup._id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <UserGroupIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{childGroup.name}</span>
                </div>
              </div>
            ))}
            {(!group.members.length && !groupMembers?.childGroups.length) && (
              <div className="px-6 py-4 text-gray-500 text-center">
                No members yet
              </div>
            )}
          </div>
        </div>
      </div>

      <GroupMembershipModal
        groupId={groupId}
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
      />
    </div>
  );
}
