"use client";

import { useState, useRef, useEffect } from "react";
import { Comment as CommentComponent } from "./Comment";
import { Comment, User } from "../lib/types";

interface CommentListProps {
  comments: Comment[];
  usersById: Record<string, User>;
  onAddComment: (content: string) => Promise<string>;
}

export function CommentList({
  comments,
  usersById,
  onAddComment,
}: CommentListProps) {
  const [newComment, setNewComment] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  console.log("comments", comments);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";
    // Set the height to match the content
    textarea.style.height = `${Math.max(textarea.scrollHeight, 72)}px`;
  }, [newComment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(newComment.trim());
    setNewComment("");
  };

  return (
    <div>
      <h2 className="text-xs font-medium text-slate-400 uppercase mb-4">
        Comments
      </h2>
      <div className="space-y-6 mb-6">
        {comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            author={usersById[comment.authorId].email}
            createdAt={new Date(comment.createdAt).toLocaleString()}
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
            className="w-full min-h-[72px] px-3 pb-12 pt-3 bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-600 transition-colors resize-none"
          />
          <div className="absolute right-3 bottom-5 flex items-center">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-1.5 bg-plum text-slate-50 text-xs rounded hover:bg-plum/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
