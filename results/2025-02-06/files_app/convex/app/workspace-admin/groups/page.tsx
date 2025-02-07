"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/components/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";

export default function GroupsPage() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const groups = useQuery(api.groups.listGroups);
  const createGroup = useMutation(api.groups.createGroup);
  const updateGroup = useMutation(api.groups.updateGroup);
  const deleteGroup = useMutation(api.groups.deleteGroup);
  const [newGroupName, setNewGroupName] = useState("");

  if (!isAdmin) {
    router.push("/");
    return null;
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName) return;

    try {
      await createGroup({ name: newGroupName });
      setNewGroupName("");
      toast.success("Group created successfully");
    } catch (error) {
      toast.error("Failed to create group");
    }
  };

  const handleDeleteGroup = async (groupId: Id<"groups">) => {
    try {
      await deleteGroup({ groupId });
      toast.success("Group deleted successfully");
    } catch (error) {
      toast.error("Failed to delete group");
    }
  };

  const handleUpdateGroup = async (groupId: Id<"groups">, name: string) => {
    try {
      await updateGroup({ groupId, name });
      toast.success("Group updated successfully");
    } catch (error) {
      toast.error("Failed to update group");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-6">Groups</h1>

      {/* Create Group Form */}
      <form onSubmit={handleCreateGroup} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter group name"
            className="flex-1 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#8D2676] text-white rounded-md hover:bg-[#7D1666] transition-colors"
          >
            Create Group
          </button>
        </div>
      </form>

      {/* Groups List */}
      {!groups ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-[#26262b] rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group._id}
              className="flex items-center justify-between p-4 bg-[#26262b] rounded-md hover:bg-[#2f2f35] cursor-pointer"
              onClick={() => router.push(`/groups/${group._id}`)}
            >
              <div className="flex items-center gap-4">
                <p className="text-white">{group.name}</p>
                {group.parentGroupId && (
                  <span className="text-sm text-[#A1A1A3]">
                    Parent: {groups.find(g => g._id === group.parentGroupId)?.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGroup(group._id);
                  }}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
