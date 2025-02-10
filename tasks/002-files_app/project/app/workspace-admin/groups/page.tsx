"use client";

import { useState } from "react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import CreateGroupModal from "@/components/CreateGroupModal";
import Link from "next/link";
import { createGroup } from "@/lib/state/groups";
import { useGroups } from "@/lib/state/groups";
import { Group } from "@/lib/types";
import { useMembers } from "@/lib/state/membership";
import { useLoggedInUser } from "@/lib/BackendContext";
import toast from "react-hot-toast";

export default function GroupsPage() {
  const user = useLoggedInUser();
  const groups = useGroups(user.id);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateGroup = async (name: string) => {
    try {
      await createGroup(user.id, name);
      setShowCreateModal(false);
    } catch (error) {
      toast.error(`Failed to create group: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                href="/workspace-admin"
                className="text-sm text-slate-400 hover:text-slate-300"
              >
                ← Back to Workspace Admin
              </Link>
              <h1 className="text-2xl font-bold text-white">Groups</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-plum-600 hover:bg-plum-700 rounded-md transition-colors"
            >
              <UserGroupIcon className="w-4 h-4 mr-1.5" />
              New Group
            </button>
          </div>
        </div>

        {/* Groups List */}
        <div className="bg-slate-900 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                >
                  Members
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {groups.map((group) => (
                <GroupRow key={group.id} group={group} />
              ))}
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
  const members = useMembers({ type: "group", groupId: group.id });
  return (
    <tr
      key={group.id}
      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <Link
          href={`/workspace-admin/group/${group.id}`}
          className="text-slate-300 hover:text-white"
        >
          {group.name}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
        {members.length} members
      </td>
    </tr>
  );
}
