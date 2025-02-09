"use client";

import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  UserIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import GroupMembershipModal from "@/components/GroupMembershipModal";
import Link from "next/link";
import { removeGroup } from "@/lib/state/groups";
import { updateGroupName, useGroups } from "@/lib/state/groups";
import { useGroup } from "@/lib/state/groups";
import { useUserByEmail, useUsers } from "@/lib/state/users";
import { Group, Member } from "@/lib/types";
import { addMember, removeMember, useMembers } from "@/lib/state/membership";

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const group = useGroup(groupId);
  if (!group) {
    notFound();
  }
  const members = useMembers({ type: "group", groupId });
  const users = useUsers();
  const groups = useGroups();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(group.name);
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  const handleUpdateName = async () => {
    if (!editedName.trim()) return;
    await updateGroupName(groupId, editedName.trim());
    setIsEditingName(false);
  };

  const handleDeleteGroup = async () => {
    await removeGroup(groupId);
    router.push("/workspace-admin/groups");
  };

  const addMemberToGroup = async (
    groupId: string,
    subject: Member["subject"]
  ) => {
    await addMember(subject, { type: "group", groupId });
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
            {members.map((member) => (
              <MemberRow key={member.id} group={group} member={member} />
            ))}
            {members.length === 0 && (
              <div className="px-6 py-4 text-gray-500 text-center">
                No members yet
              </div>
            )}
          </div>
        </div>
      </div>

      <GroupMembershipModal
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
        group={group}
        addMember={addMemberToGroup}
        users={users}
        groups={groups}
      />
    </div>
  );
}

function MemberRow({ group, member }: { group: Group; member: Member }) {
  if (member.subject.type === "user") {
    return (
      <UserRow
        member={member}
        group={group}
        memberUserId={member.subject.userId}
      />
    );
  } else if (member.subject.type === "group") {
    return (
      <GroupRow
        group={group}
        member={member}
        memberGroupId={member.subject.groupId}
      />
    );
  } else {
    throw new Error("Invalid member type");
  }
}

function UserRow({
  member,
  group,
  memberUserId,
}: {
  member: Member;
  group: Group;
  memberUserId: string;
}) {
  const user = useUserByEmail(memberUserId);
  if (!user) {
    throw new Error("User not found");
  }
  return (
    <div
      key={`${member.subject.type}-${memberUserId}`}
      className="px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <UserIcon className="w-5 h-5 text-gray-400" />
        <span className="text-gray-300">{user.email}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => removeMember(member.id)}
          className="text-gray-400 hover:text-red-400 ml-4"
          title="Remove Member"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function GroupRow({
  group,
  member,
  memberGroupId,
}: {
  group: Group;
  member: Member;
  memberGroupId: string;
}) {
  const subgroup = useGroup(memberGroupId);
  if (!subgroup) {
    throw new Error("Subgroup not found");
  }
  return (
    <div
      key={`${member.subject.type}-${memberGroupId}`}
      className="px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <UserGroupIcon className="w-5 h-5 text-gray-400" />
        <span className="text-gray-300">{subgroup.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => removeMember(member.id)}
          className="text-gray-400 hover:text-red-400 ml-4"
          title="Remove Member"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
