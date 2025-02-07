"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/components/UserContext";
import { Id } from "@/convex/_generated/dataModel";

export function useProjects() {
  const { userId, isLoading: userLoading } = useUser();
  const projects = useQuery(api.queries.getUserProjects,
    userId ? { userId } : "skip"
  );

  const createProject = useMutation(api.projects.createProject);
  const updateProject = useMutation(api.projects.updateProject);
  const deleteProject = useMutation(api.projects.deleteProject);
  const addProjectMember = useMutation(api.projects.addProjectMember);
  const removeProjectMember = useMutation(api.projects.removeProjectMember);
  const addProjectGroupMember = useMutation(api.projects.addProjectGroupMember);
  const removeProjectGroupMember = useMutation(
    api.projects.removeProjectGroupMember
  );

  return {
    projects: projects ?? [],
    isLoading: userLoading || (userId && projects === undefined),
    createProject: async (name: string, description: string, emoji: string) => {
      return await createProject({ name, description, emoji });
    },
    updateProject: async (
      projectId: Id<"projects">,
      name: string,
      description: string,
      emoji: string
    ) => {
      return await updateProject({ projectId, name, description, emoji });
    },
    deleteProject: async (projectId: Id<"projects">) => {
      return await deleteProject({ projectId });
    },
    addProjectMember: async (projectId: Id<"projects">, userId: Id<"users">) => {
      return await addProjectMember({ projectId, userId });
    },
    removeProjectMember: async (projectId: Id<"projects">, userId: Id<"users">) => {
      return await removeProjectMember({ projectId, userId });
    },
    addProjectGroupMember: async (
      projectId: Id<"projects">,
      groupId: Id<"groups">
    ) => {
      return await addProjectGroupMember({ projectId, groupId });
    },
    removeProjectGroupMember: async (
      projectId: Id<"projects">,
      groupId: Id<"groups">
    ) => {
      return await removeProjectGroupMember({ projectId, groupId });
    },
  };
}