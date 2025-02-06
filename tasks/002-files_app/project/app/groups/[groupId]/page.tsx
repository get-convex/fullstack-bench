"use client";

import { useParams } from "next/navigation";
import { Member, useGroup, useGroupMembers, useUser } from "../../../testData";
import { UserIcon } from "@heroicons/react/24/outline";

export default function GroupPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const group = useGroup(groupId);
  const members = useGroupMembers(groupId);

  if (!group) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Group not found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117] text-gray-300">
      <div className="flex-1 max-w-5xl w-full mx-auto p-6">
        <div className="flex items-center space-x-3 mb-8">
          <span className="text-2xl">👥</span>
          <h1 className="text-2xl font-bold text-white">{group.name}</h1>
        </div>

        {/* Members Section */}
        <div className="bg-[#161B22] rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-medium text-white">Members</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {members.map((member) => (
              <GroupMemberRow key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Group Access Section */}
        <div className="mt-6 bg-[#161B22] rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-medium text-white">Group Access</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-400">
              View project access and permissions in the workspace admin panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupMemberRow({ member }: { member: Member }) {
  if (member.subject.type === "user") {
    const userId = member.subject.userId;
    return <UserRow userId={userId} />;
  } else {
    const groupId = member.subject.groupId;
    return <GroupRow groupId={groupId} />;
  }
}

function UserRow({ userId }: { userId: string }) {
  const user = useUser(userId);
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <UserIcon className="w-5 h-5 text-gray-400" />
        <span className="text-gray-300">{user?.email || ""}</span>
      </div>
    </div>
  );
}

function GroupRow({ groupId }: { groupId: string }) {
  const group = useGroup(groupId);
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <UserIcon className="w-5 h-5 text-gray-400" />
        <span className="text-gray-300">{group?.name || ""}</span>
      </div>
    </div>
  );
}
