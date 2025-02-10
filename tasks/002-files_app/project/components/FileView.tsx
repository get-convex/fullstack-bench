"use client";

import type { File } from "@/lib/types";
import {
  DocumentIcon,
  FolderIcon,
  FolderPlusIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import "highlight.js/styles/default.css";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import markdown from "highlight.js/lib/languages/markdown";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import Breadcrumb from "./Breadcrumb";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("json", json);
hljs.registerLanguage("css", css);
hljs.registerLanguage("html", html);

const getLanguageFromFilename = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "jsx":
      return "jsx";
    case "tsx":
      return "tsx";
    case "md":
      return "markdown";
    case "json":
      return "json";
    case "css":
      return "css";
    case "html":
      return "html";
    default:
      return "plaintext";
  }
};

export default function FileView({
  file,
  pathSegments,
  projectId,
  handleEditFile,
}: {
  file: File;
  pathSegments: string[];
  projectId: string;
  handleEditFile: (content: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(file.content || "");

  const language = getLanguageFromFilename(file.parentEdge.name);
  const highlighted = hljs.highlight(file.content || "", { language }).value;

  return (
    <div className="w-full border-r border-slate-700 overflow-y-auto bg-slate-950">
      <Breadcrumb pathSegments={pathSegments} projectId={projectId}>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            title={isEditing ? "Save" : "Edit"}
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>
      </Breadcrumb>
      {/* File Content */}
      <div className="p-4">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-[calc(100vh-12rem)] font-mono text-sm bg-slate-900 text-slate-100 p-4 rounded-lg border border-slate-700 focus:border-plum-600 focus:ring-plum-600 resize-none"
          />
        ) : (
          <div className="relative">
            <pre className="!bg-slate-900 !p-4 rounded-lg border border-slate-700 overflow-x-auto">
              <code dangerouslySetInnerHTML={{ __html: highlighted }} />
            </pre>
            <div className="absolute top-3 right-3 text-xs text-slate-500 font-mono px-2 py-1 rounded bg-slate-800">
              {language}
            </div>
          </div>
        )}
      </div>

      {/* Edit Actions */}
      {isEditing && (
        <div className="px-4 py-3 border-t border-slate-700 flex justify-end space-x-3">
          <button
            onClick={() => {
              setIsEditing(false);
              setEditedContent(file.content || "");
            }}
            className="px-3 py-2 text-sm text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await handleEditFile(editedContent);
              setIsEditing(false);
            }}
            className="px-3 py-2 text-sm bg-plum-600 text-white rounded-md hover:bg-plum-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
