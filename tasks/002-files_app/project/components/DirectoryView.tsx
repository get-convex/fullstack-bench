"use client";

import { Directory, File } from "@/testData";
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
  currentDir: (File | Directory)[];
  handleNavigateUp: () => void;
  handleFileClick: (file: File | Directory) => void;
  handleDeleteFile: (file: File | Directory) => void;
}) {
  const [showCreateFileModal, setShowCreateFileModal] = useState(false);
  const [showCreateDirModal, setShowCreateDirModal] = useState(false);
  const [editingFile, setEditingFile] = useState<File | Directory | null>(null);
  const [editedName, setEditedName] = useState("");

  const handleCreateFile = (name: string, content: string) => {
    // TODO: Implement file creation with content
    const newFile: File = {
      id: crypto.randomUUID(),
      name,
      type: "file",
      content,
      createdBy: "user1", // TODO: Get from current user
      createdAt: new Date(),
      modifiedAt: new Date(),
      parentId: props.currentDir.find(f => f.type === "directory")?.id || "", // Use empty string as fallback for root
    };
    // TODO: Add file to the current directory
    setShowCreateFileModal(false);
  };

  const handleCreateDirectory = (name: string) => {
    // TODO: Implement directory creation
    const newDirectory: Directory = {
      id: crypto.randomUUID(),
      name,
      type: "directory",
      createdBy: "user1", // TODO: Get from current user
      createdAt: new Date(),
      modifiedAt: new Date(),
      parentId: props.currentDir.find(f => f.type === "directory")?.id || "", // Use empty string as fallback for root
    };
    // TODO: Add directory to the current directory
    setShowCreateDirModal(false);
  };

  const handleStartRename = (file: File | Directory) => {
    setEditingFile(file);
    setEditedName(file.name);
  };

  const handleFinishRename = () => {
    if (!editingFile || !editedName.trim() || editedName === editingFile.name) {
      setEditingFile(null);
      setEditedName("");
      return;
    }

    // TODO: Implement rename functionality
    // For now, just reset the state
    setEditingFile(null);
    setEditedName("");
  };

  return (
    <div className="w-full border-r border-gray-800 overflow-y-auto bg-[#0D1117]">
      <Breadcrumb pathSegments={props.pathSegments} projectId={props.projectId}>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateFileModal(true)}
            className="inline-flex items-center px-2 py-1 text-sm text-gray-400 hover:text-white rounded transition-colors"
            title="Create new file"
          >
            <DocumentIcon className="w-4 h-4 mr-1.5" />
            Add file
          </button>
          <button
            onClick={() => setShowCreateDirModal(true)}
            className="inline-flex items-center px-2 py-1 text-sm text-gray-400 hover:text-white rounded transition-colors"
            title="Create new directory"
          >
            <FolderPlusIcon className="w-4 h-4 mr-1.5" />
            Add directory
          </button>
        </div>
      </Breadcrumb>

      {/* File List */}
      <div className="py-2">
        {props.currentDir.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <FolderPlusIcon className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-sm font-medium text-white mb-1">
              Empty directory
            </h3>
            <p className="text-sm text-gray-400 text-center mb-4">
              Get started by creating a new file or directory
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateFileModal(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#8D2676] hover:bg-[#7A2065] rounded-md transition-colors"
              >
                <DocumentIcon className="w-4 h-4 mr-1.5" />
                Add file
              </button>
              <button
                onClick={() => setShowCreateDirModal(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#8D2676] hover:bg-[#7A2065] rounded-md transition-colors"
              >
                <FolderPlusIcon className="w-4 h-4 mr-1.5" />
                Add directory
              </button>
            </div>
          </div>
        ) : (
          props.currentDir.map((file) => (
            <div
              key={file.id}
              className="group flex items-center justify-between px-4 py-2 hover:bg-gray-800 transition-colors"
            >
              {editingFile?.id === file.id ? (
                <div className="flex items-center space-x-2 flex-1">
                  {file.type === "directory" ? (
                    <FolderIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <DocumentIcon className="w-5 h-5 text-gray-400" />
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
                    className="flex-1 bg-[#1C2128] border-gray-700 rounded-md text-gray-300 text-sm focus:border-[#8D2676] focus:ring-[#8D2676]"
                    autoFocus
                  />
                </div>
              ) : (
                <Link
                  href={`/projects/${props.projectId}/files/${[
                    ...props.pathSegments,
                    file.name,
                  ].join("/")}`}
                  className="flex items-center space-x-2 cursor-pointer flex-1"
                >
                  {file.type === "directory" ? (
                    <FolderIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <DocumentIcon className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-300">
                    {file.name}
                  </span>
                </Link>
              )}
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartRename(file);
                  }}
                  className="p-1 text-gray-400 hover:text-white inline-flex items-center"
                  title="Rename"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span className="ml-1 text-sm">Rename</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    props.handleDeleteFile(file);
                  }}
                  className="p-1 text-gray-400 hover:text-red-400 inline-flex items-center ml-2"
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
