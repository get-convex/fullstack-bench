"use client";

import { notFound, useParams } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/outline";
import { Member } from "@/lib/types";
import { useLoggedInUser } from "@/lib/BackendContext";
import { Spinner } from "@/components/Spinner";
import { initialGroups, initialUsers } from "@/lib/exampleData";
import { initialMembers } from "@/lib/exampleData";

export default function GroupPage() {
  const params = useParams();
  const user = useLoggedInUser();
  const groupId = params.groupId as string;
  const group = initialGroups.find((group) => group.id === groupId);
  const members = initialMembers.filter(
    (member) =>
      member.object.type === "group" && member.object.groupId === groupId
  );

  if (group === undefined || members === undefined) {
    return <Spinner />;
  }

  if (!group) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-300">
      <div className="flex-1 max-w-5xl w-full mx-auto p-6">
        <div className="flex items-center space-x-3 mb-8">
          <span className="text-2xl">👥</span>
          <h1 className="text-2xl font-bold text-white">{group.name}</h1>
        </div>

        {/* Members Section */}
        <div className="bg-slate-900 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-medium text-white">Members</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {members.map((member) => (
              <GroupMemberRow key={member.id} member={member} />
            ))}
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
  const user = initialUsers.find((user) => user.id === userId) ?? null;
  if (user === undefined) {
    return <Spinner />;
  }
  if (user === null) {
    throw new Error("User not found");
  }
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <UserIcon className="w-5 h-5 text-slate-400" />
        <span className="text-slate-300">{user.email}</span>
      </div>
    </div>
  );
}

function GroupRow({ groupId }: { groupId: string }) {
  const group = initialGroups.find((group) => group.id === groupId) ?? null;
  if (group === undefined) {
    return <Spinner />;
  }
  if (group === null) {
    throw new Error("Group not found");
  }
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <UserIcon className="w-5 h-5 text-slate-400" />
        <span className="text-slate-300">{group.name}</span>
      </div>
    </div>
  );
}
