"use client";

import type { Directory, File } from "@/lib/types";
import {
  DocumentIcon,
  FolderIcon,
  FolderPlusIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import Breadcrumb from "./Breadcrumb";
import CreateFileModal from "./CreateFileModal";
import CreateDirectoryModal from "./CreateDirectoryModal";

export default function DirectoryView(props: {
  projectId: string;
  pathSegments: string[];
  currentDirId: string | undefined;
  dirChildren: (File | Directory)[];
  handleCreate: (
    name: string,
    node: { type: "file"; content: string } | { type: "directory" }
  ) => Promise<void>;
  handleRename: (
    node: { type: "file" | "directory"; id: string },
    newName: string
  ) => Promise<void>;
  handleDelete: (node: {
    type: "file" | "directory";
    id: string;
  }) => Promise<void>;
}) {
  const [showCreateFileModal, setShowCreateFileModal] = useState(false);
  const [showCreateDirModal, setShowCreateDirModal] = useState(false);
  const [editingFile, setEditingFile] = useState<File | Directory | null>(null);
  const [editedName, setEditedName] = useState("");

  const handleCreateFile = async (name: string, content: string) => {
    await props.handleCreate(name, { type: "file", content });
    setShowCreateFileModal(false);
  };

  const handleCreateDirectory = async (name: string) => {
    await props.handleCreate(name, { type: "directory" });
    setShowCreateDirModal(false);
  };

  const handleStartRename = (file: File | Directory) => {
    setEditingFile(file);
    setEditedName(file.parentEdge?.name || "");
  };

  const handleFinishRename = async () => {
    if (
      !editingFile ||
      !editedName.trim() ||
      editedName === editingFile.parentEdge?.name
    ) {
      setEditingFile(null);
      setEditedName("");
      return;
    }
    const type = "content" in editingFile ? "file" : "directory";
    await props.handleRename({ type, id: editingFile.id }, editedName);
    setEditingFile(null);
    setEditedName("");
  };

  const handleDeleteFile = (file: File | Directory) => {
    const type = "content" in file ? "file" : "directory";
    props.handleDelete({ type, id: file.id });
  };

  return (
    <div className="w-full border-r border-slate-700 overflow-y-auto bg-slate-950">
      <Breadcrumb pathSegments={props.pathSegments} projectId={props.projectId}>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateFileModal(true)}
            className="inline-flex items-center px-2 py-1 text-sm text-slate-400 hover:text-white rounded transition-colors"
            title="Create new file"
          >
            <DocumentIcon className="w-4 h-4 mr-1.5" />
            Add file
          </button>
          <button
            onClick={() => setShowCreateDirModal(true)}
            className="inline-flex items-center px-2 py-1 text-sm text-slate-400 hover:text-white rounded transition-colors"
            title="Create new directory"
          >
            <FolderPlusIcon className="w-4 h-4 mr-1.5" />
            Add directory
          </button>
        </div>
      </Breadcrumb>

      {/* File List */}
      <div className="py-2">
        {props.dirChildren.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <FolderPlusIcon className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-sm font-medium text-white mb-1">
              Empty directory
            </h3>
            <p className="text-sm text-slate-400 text-center mb-4">
              Get started by creating a new file or directory
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateFileModal(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-plum-600 hover:bg-plum-700 rounded-md transition-colors"
              >
                <DocumentIcon className="w-4 h-4 mr-1.5" />
                Add file
              </button>
              <button
                onClick={() => setShowCreateDirModal(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-plum-600 hover:bg-plum-700 rounded-md transition-colors"
              >
                <FolderPlusIcon className="w-4 h-4 mr-1.5" />
                Add directory
              </button>
            </div>
          </div>
        ) : (
          props.dirChildren.map((file) => (
            <div
              key={file.id}
              className="group flex items-center justify-between px-4 py-2 hover:bg-slate-800 transition-colors"
            >
              {editingFile?.id === file.id ? (
                <div className="flex items-center space-x-2 flex-1">
                  {"content" in file ? (
                    <DocumentIcon className="w-5 h-5 text-slate-400" />
                  ) : (
                    <FolderIcon className="w-5 h-5 text-slate-400" />
                  )}
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFinishRename();
                      if (e.key === "Escape") {
                        setEditingFile(null);
                        setEditedName("");
                      }
                    }}
                    onBlur={handleFinishRename}
                    className="flex-1 bg-slate-900 border-slate-700 rounded-md text-slate-300 text-sm focus:border-plum-600 focus:ring-plum-600"
                    autoFocus
                  />
                </div>
              ) : (
                <Link
                  href={`/projects/${props.projectId}/files/${[
                    ...props.pathSegments,
                    file.parentEdge?.name,
                  ].join("/")}`}
                  className="flex items-center space-x-2 cursor-pointer flex-1"
                >
                  {"content" in file ? (
                    <DocumentIcon className="w-5 h-5 text-slate-400" />
                  ) : (
                    <FolderIcon className="w-5 h-5 text-slate-400" />
                  )}
                  <span className="text-sm text-slate-300">
                    {file.parentEdge?.name}
                  </span>
                </Link>
              )}
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartRename(file);
                  }}
                  className="p-1 text-slate-400 hover:text-white inline-flex items-center"
                  title="Rename"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span className="ml-1 text-sm">Rename</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file);
                  }}
                  className="p-1 text-slate-400 hover:text-red-400 inline-flex items-center ml-2"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span className="ml-1 text-sm">Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateFileModal
        isOpen={showCreateFileModal}
        onClose={() => setShowCreateFileModal(false)}
        onCreateFile={handleCreateFile}
      />
      <CreateDirectoryModal
        isOpen={showCreateDirModal}
        onClose={() => setShowCreateDirModal(false)}
        onCreateDirectory={handleCreateDirectory}
      />
    </div>
  );
}
