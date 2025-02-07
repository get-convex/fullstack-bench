"use client";

import { useUser } from "@/components/UserContext";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useWorkspace } from "@/hooks/useWorkspace";

export default function GroupPage() {
  const router = useRouter();
  const params = useParams();
  const { isAdmin } = useUser();
  const { users } = useWorkspace();
  const groups = useQuery(api.groups.listGroups);
  const groupMembers = useQuery(api.queries.getGroupMembers, {
    groupId: params.groupId as Id<"groups">
  });
  const updateGroup = useMutation(api.groups.updateGroup);
  const addGroupMember = useMutation(api.groups.addGroupMember);
  const removeGroupMember = useMutation(api.groups.removeGroupMember);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");

  if (!isAdmin) {
    router.push("/");
    return null;
  }

  const group = groups?.find(g => g._id === params.groupId);
  if (!groups || !group) {
    return (
      <div className="p-6">
        <div className="h-32 bg-[#26262b] rounded-md animate-pulse"></div>
      </div>
    );
  }

  const [selectedParentId, setSelectedParentId] = useState<string>(group.parentGroupId ?? "");

  const handleUpdateName = async () => {
    if (!newName) return;
    try {
      await updateGroup({
        groupId: params.groupId as Id<"groups">,
        name: newName,
        parentGroupId: group.parentGroupId
      });
      setIsEditing(false);
      toast.success("Group name updated successfully");
    } catch (error) {
      toast.error("Failed to update group name");
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    try {
      await addGroupMember({
        groupId: params.groupId as Id<"groups">,
        userId: selectedUserId as Id<"users">
      });
      setSelectedUserId("");
      toast.success("Member added successfully");
    } catch (error) {
      toast.error("Failed to add member");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeGroupMember({
        groupId: params.groupId as Id<"groups">,
        userId: userId as Id<"users">
      });
      toast.success("Member removed successfully");
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  const handleUpdateParent = async () => {
    try {
      await updateGroup({
        groupId: params.groupId as Id<"groups">,
        name: group.name,
        parentGroupId: selectedParentId ? (selectedParentId as Id<"groups">) : undefined
      });
      toast.success("Parent group updated successfully");
    } catch (error) {
      toast.error("Failed to update parent group");
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId) return;

    try {
      await updateGroup({
        groupId: selectedChildId as Id<"groups">,
        name: groups.find(g => g._id === selectedChildId)?.name ?? "",
        parentGroupId: params.groupId as Id<"groups">
      });
      setSelectedChildId("");
      toast.success("Child group added successfully");
    } catch (error) {
      toast.error("Failed to add child group");
    }
  };

  const handleRemoveChild = async (childId: Id<"groups">) => {
    try {
      await updateGroup({
        groupId: childId,
        name: groups.find(g => g._id === childId)?.name ?? "",
        parentGroupId: undefined
      });
      toast.success("Child group removed successfully");
    } catch (error) {
      toast.error("Failed to remove child group");
    }
  };

  // Filter out the current group and its children from parent group options
  const availableParentGroups = groups.filter(g =>
    g._id !== params.groupId &&
    !groupMembers?.childGroups.some(child => child._id === g._id)
  );

  // Filter out the current group, its parent, and any groups that would create cycles
  const availableChildGroups = groups.filter(g =>
    g._id !== params.groupId &&
    g._id !== group.parentGroupId &&
    !g.parentGroupId // Only show groups without parents
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        {isEditing ? (
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              className="bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
            />
            <button
              onClick={handleUpdateName}
              className="px-4 py-2 bg-[#8D2676] text-white rounded-md hover:bg-[#7D1666] transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-[#3f3f46] text-white rounded-md hover:bg-[#52525b] transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-white">{group.name}</h1>
            <button
              onClick={() => {
                setNewName(group.name);
                setIsEditing(true);
              }}
              className="text-sm text-[#A1A1A3] hover:text-white"
            >
              Edit
            </button>
          </div>
        )}
        {group.parentGroupId && (
          <p className="text-[#A1A1A3] mt-2">
            Parent Group: {groups.find(g => g._id === group.parentGroupId)?.name}
          </p>
        )}
      </div>

      {/* Parent Group Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-white mb-4">Parent Group</h2>
        <div className="flex gap-4">
          <select
            value={selectedParentId}
            onChange={(e) => setSelectedParentId(e.target.value)}
            className="flex-1 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
          >
            <option value="">No Parent Group</option>
            {availableParentGroups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleUpdateParent}
            className="px-4 py-2 bg-[#8D2676] text-white rounded-md hover:bg-[#7D1666] transition-colors"
          >
            Update Parent
          </button>
        </div>
      </div>

      {/* Add Child Group Form */}
      <form onSubmit={handleAddChild} className="mb-8">
        <h2 className="text-lg font-medium text-white mb-4">Add Child Group</h2>
        <div className="flex gap-4">
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="flex-1 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
          >
            <option value="">Select a group</option>
            {availableChildGroups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-[#8D2676] text-white rounded-md hover:bg-[#7D1666] transition-colors"
          >
            Add Child
          </button>
        </div>
      </form>

      {/* Members Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-white mb-4">Members</h2>
        {!groupMembers ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-[#26262b] rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {groupMembers.directMembers.map((userId) => {
              const user = users.find(u => u.userId === userId);
              return (
                <div
                  key={userId}
                  className="flex items-center justify-between p-3 bg-[#26262b] rounded-md"
                >
                  <span className="text-[#E1E1E3]">{user?.email ?? userId}</span>
                  <button
                    onClick={() => handleRemoveMember(userId)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Child Groups Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-white mb-4">Child Groups</h2>
        {!groupMembers ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-[#26262b] rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {groupMembers.childGroups.map((childGroup) => (
              <div
                key={childGroup._id}
                className="flex items-center justify-between p-3 bg-[#26262b] rounded-md hover:bg-[#2f2f35] cursor-pointer group"
              >
                <span
                  className="text-[#E1E1E3] flex-1"
                  onClick={() => router.push(`/groups/${childGroup._id}`)}
                >
                  {childGroup.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChild(childGroup._id);
                  }}
                  className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Member Form */}
      <form onSubmit={handleAddMember} className="mb-8">
        <h2 className="text-lg font-medium text-white mb-4">Add Member</h2>
        <div className="flex gap-4">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 bg-[#26262b] text-white px-4 py-2 rounded-md border border-[#3f3f46] focus:outline-none focus:border-[#8D2676]"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.email}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-[#8D2676] text-white rounded-md hover:bg-[#7D1666] transition-colors"
          >
            Add Member
          </button>
        </div>
      </form>
    </div>
  );
}
