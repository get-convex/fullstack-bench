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
import { Member } from "@/lib/types";
import { useLoggedInUser } from "@/lib/BackendContext";
import toast from "react-hot-toast";
import { Spinner } from "@/components/Spinner";
import { initialGroups, initialMembers, initialUsers } from "@/lib/exampleData";

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const user = useLoggedInUser();
  const groupId = params.groupId as string;

  const members = initialMembers.filter(
    (member) =>
      member.object.type === "group" && member.object.groupId === groupId
  );
  const users = initialUsers;
  const groups = initialGroups;

  if (members === undefined || users === undefined || groups === undefined) {
    return <Spinner />;
  }

  const group = groups.find((group) => group.id === groupId);
  if (!group) {
    notFound();
  }

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(group.name);
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  const handleUpdateName = async () => {
    throw new Error("Not implemented");
  };
  const handleDeleteGroup = async () => {
    throw new Error("Not implemented");
  };
  const addMemberToGroup = async (
    groupId: string,
    subject: Member["subject"]
  ) => {
    throw new Error("Not implemented");
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/workspace-admin/groups"
                className="text-sm text-slate-400 hover:text-slate-300"
              >
                ← Back to Groups
              </Link>
              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-slate-800 border-slate-700 rounded-md text-slate-300 text-xl font-bold focus:border-plum-600 focus:ring-plum-600"
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
                    className="text-sm text-slate-400 hover:text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <span>{group.name}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-slate-400 hover:text-slate-300"
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
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-plum-600 hover:bg-plum-700 rounded-md transition-colors"
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
        <div className="bg-slate-900 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-medium text-white">Members</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {members.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
            {members.length === 0 && (
              <div className="px-6 py-4 text-slate-500 text-center">
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

function MemberRow({ member }: { member: Member }) {
  if (member.subject.type === "user") {
    return <UserRow member={member} memberUserId={member.subject.userId} />;
  } else if (member.subject.type === "group") {
    return <GroupRow member={member} memberGroupId={member.subject.groupId} />;
  } else {
    throw new Error("Invalid member type");
  }
}

function UserRow({
  member,
  memberUserId,
}: {
  member: Member;
  memberUserId: string;
}) {
  const user = initialUsers.find((user) => user.id === memberUserId) ?? null;
  if (user === undefined) {
    return <Spinner />;
  }
  if (user === null) {
    throw new Error("User not found");
  }
  return (
    <div
      key={`${member.subject.type}-${memberUserId}`}
      className="px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <UserIcon className="w-5 h-5 text-slate-400" />
        <span className="text-slate-300">{user.email}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            throw new Error("Not implemented");
          }}
          className="text-slate-400 hover:text-red-400 ml-4"
          title="Remove Member"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function GroupRow({
  member,
  memberGroupId,
}: {
  member: Member;
  memberGroupId: string;
}) {
  const subgroup =
    initialGroups.find((group) => group.id === memberGroupId) ?? null;
  if (subgroup === undefined) {
    return <Spinner />;
  }
  if (subgroup === null) {
    throw new Error("Subgroup not found");
  }
  return (
    <div
      key={`${member.subject.type}-${memberGroupId}`}
      className="px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <UserGroupIcon className="w-5 h-5 text-slate-400" />
        <span className="text-slate-300">{subgroup.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            throw new Error("Not implemented");
          }}
          className="text-slate-400 hover:text-red-400 ml-4"
          title="Remove Member"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
