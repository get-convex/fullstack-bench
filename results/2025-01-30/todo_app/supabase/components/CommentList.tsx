"use client";

import { useState, useRef, useEffect } from "react";
import { Comment as CommentComponent } from "./Comment";
import { Database } from "@/lib/database.types";

type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  author: { id: string; email: string } | null;
};

interface CommentListProps {
  taskId: string;
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
}

export function CommentList({
  taskId,
  comments,
  onAddComment,
}: CommentListProps) {
  const [newComment, setNewComment] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";
    // Set the height to match the content
    textarea.style.height = `${Math.max(textarea.scrollHeight, 72)}px`;
  }, [newComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await onAddComment(newComment.trim());
    setNewComment("");
  };

  return (
    <div>
      <h2 className="text-xs font-medium text-[#8A8A8A] uppercase mb-4">
        Comments
      </h2>
      <div className="space-y-6 mb-6">
        {comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            author={comment.author?.email ?? "Unknown"}
            createdAt={comment.created_at}
            content={comment.content}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full min-h-[72px] px-3 pb-12 pt-3 bg-[#1A1A1A] text-[#E1E1E1] text-sm rounded placeholder-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#4A4A4A] transition-colors resize-none"
          />
          <div className="absolute right-3 bottom-5 flex items-center">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-1.5 bg-[#4A4A4A] text-white text-xs rounded hover:bg-[#5A5A5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
