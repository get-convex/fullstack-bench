"use client";

import { File } from "@/testData";
import { DocumentIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
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
}: {
  file: File;
  pathSegments: string[];
  projectId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(file.content || "");
  const [isClient, setIsClient] = useState(false);

  const language = getLanguageFromFilename(file.name);
  const highlighted = hljs.highlight(file.content || "", { language }).value;

  return (
    <div className="w-full border-r border-gray-800 overflow-y-auto bg-[#0D1117]">
      <Breadcrumb pathSegments={pathSegments} projectId={projectId}>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
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
            className="w-full h-[calc(100vh-12rem)] font-mono text-sm bg-[#1E1E1E] text-gray-100 p-4 rounded-lg border border-gray-700 focus:border-[#8D2676] focus:ring-[#8D2676] resize-none"
          />
        ) : (
          <div className="relative">
            {isClient ? (
              <>
                <pre className="!bg-[#1E1E1E] !p-4 rounded-lg border border-gray-700 overflow-x-auto">
                  <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                </pre>
                <div className="absolute top-3 right-3 text-xs text-gray-500 font-mono px-2 py-1 rounded bg-gray-800">
                  {language}
                </div>
              </>
            ) : (
              <pre className="!bg-[#1E1E1E] !p-4 rounded-lg border border-gray-700 overflow-x-auto">
                <code>{file.content || ""}</code>
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Edit Actions */}
      {isEditing && (
        <div className="px-4 py-3 border-t border-gray-800 flex justify-end space-x-3">
          <button
            onClick={() => {
              setIsEditing(false);
              setEditedContent(file.content || "");
            }}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // TODO: Implement save functionality
              setIsEditing(false);
            }}
            className="px-3 py-2 text-sm bg-[#8D2676] text-white rounded-md hover:bg-[#7A2065] transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
