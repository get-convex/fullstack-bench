"use client";

import { useState, useRef, useEffect } from "react";
import { Comment as CommentComponent } from "./Comment";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface CommentListProps {
  taskId: Id<"tasks">;
}

export function CommentList({ taskId }: CommentListProps) {
  const [newComment, setNewComment] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const comments = useQuery(api.comments.list, { taskId });
  const createComment = useMutation(api.comments.create);

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

    try {
      await createComment({
        taskId,
        content: newComment.trim(),
      });
      setNewComment("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  if (!comments) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xs font-medium text-[#8A8A8A] uppercase mb-4">
        Comments
      </h2>
      <div className="space-y-6 mb-6">
        {comments.map((comment) => (
          <CommentComponent
            key={comment._id}
            author={comment.authorId}
            createdAt={comment._creationTime}
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
