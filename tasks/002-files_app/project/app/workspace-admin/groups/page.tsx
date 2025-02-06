"use client";

import { useState } from "react";
import { useGroups, createGroup, Group, useGroupMembers } from "@/testData";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import CreateGroupModal from "@/components/CreateGroupModal";
import Link from "next/link";

export default function GroupsPage() {
  const groups = useGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateGroup = (name: string) => {
    createGroup(name);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                href="/workspace-admin"
                className="text-sm text-gray-400 hover:text-gray-300"
              >
                ← Back to Workspace Admin
              </Link>
              <h1 className="text-2xl font-bold text-white">Groups</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#8D2676] hover:bg-[#7A2065] rounded-md transition-colors"
            >
              <UserGroupIcon className="w-4 h-4 mr-1.5" />
              New Group
            </button>
          </div>
        </div>

        {/* Groups List */}
        <div className="bg-[#161B22] rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-[#1C2128]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Members
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {groups.map((group) => <GroupRow key={group.id} group={group} />)}
            </tbody>
          </table>
        </div>
      </div>

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
}

function GroupRow({ group }: { group: Group }) {
  const members = useGroupMembers(group.id);
  return (
    <tr
      key={group.id}
      className="hover:bg-gray-800/50 cursor-pointer transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <Link
          href={`/workspace-admin/group/${group.id}`}
          className="text-gray-300 hover:text-white"
        >
          {group.name}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {members.length} members
      </td>
    </tr>
  );
}
