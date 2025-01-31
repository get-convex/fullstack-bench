"use client";

import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CommentProps {
  author: string;
  createdAt: string;
  content: string;
}

export function Comment({ author, createdAt, content }: CommentProps) {
  return (
    <div className="group">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-sm font-medium text-white">{author}</span>
        <span className="text-xs text-[#8A8A8A] opacity-0 group-hover:opacity-100 transition-opacity">
          {format(new Date(createdAt), "MMM d, yyyy 'at' h:mm a")}
        </span>
      </div>
      <div className="text-[#E1E1E1] text-sm prose prose-invert max-w-none prose-sm prose-p:leading-normal prose-p:my-0 prose-headings:my-0 prose-ul:my-1 prose-ol:my-1 prose-ul:pl-0 prose-ol:pl-0 prose-li:my-0.5 prose-li:pl-0 prose-pre:bg-[#242424] prose-pre:border prose-pre:border-[#363639]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            ul: ({ children }) => (
              <ul className="list-disc list-inside">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside">{children}</ol>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
