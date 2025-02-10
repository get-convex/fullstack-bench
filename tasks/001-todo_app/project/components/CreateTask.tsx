"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Modal } from "./Modal";
import { Task, Project } from "@/lib/types";

interface CreateTaskProps {
  project: Project;
  createTask: (
    projectId: string,
    title: string,
    description: string,
    status: Task["status"],
    dueDate: number | null,
    assigneeId: string | null
  ) => Promise<string>;
  setIsCreatingTask: (isCreating: boolean) => void;
}

const css = `
  .rdp {
    --rdp-cell-size: 32px;
    --rdp-accent-color: #475569; /* slate-600 */
    --rdp-background-color: #1e293b; /* slate-800 */
    --rdp-accent-color-dark: #f1f5f9; /* slate-100 */
    --rdp-background-color-dark: #0f172a; /* slate-900 */
    --rdp-outline: 2px solid var(--rdp-accent-color);
    --rdp-outline-selected: 2px solid var(--rdp-accent-color);
    margin: 0;
  }

  .rdp-months {
    background: var(--rdp-background-color-dark);
    padding: 0.75rem;
    border-radius: 6px;
  }

  .rdp-month_caption {
    padding: 0 0 0.75rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #1e293b; /* slate-800 */
  }

  .rdp-caption_label {
    font-size: 0.875rem;
    color: #f1f5f9; /* slate-100 */
    font-weight: 500;
  }

  .rdp-button_previous,
  .rdp-button_next {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    color: #64748b; /* slate-500 */
  }

  .rdp-button_previous:hover,
  .rdp-button_next:hover {
    color: #f1f5f9; /* slate-100 */
    background-color: #1e293b; /* slate-800 */
  }

  .rdp-nav {
    color: #64748b; /* slate-500 */
    position: absolute;
    right: 22px;
  }

  .rdp-nav svg {
    fill: currentColor;
    stroke: currentColor;
  }

  .rdp-head_cell {
    font-size: 0.75rem;
    font-weight: 500;
    color: #f1f5f9; /* slate-100 */
    text-transform: uppercase;
    padding-bottom: 0.75rem;
  }

  .rdp-tbody {
    margin-top: 0.5rem;
  }

  .rdp-cell {
    color: #64748b; /* slate-500 */
  }

  .rdp-day {
    color: #64748b; /* slate-500 */
    width: 32px;
    height: 32px;
    border-radius: 4px;
    font-size: 0.875rem;
    text-align: center;
  }

  .rdp-weekday {
    color: #64748b; /* slate-500 */
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
  }

  .rdp-day_today {
    color: #f1f5f9; /* slate-100 */
    font-weight: 600;
    background-color: #1e293b; /* slate-800 */
  }

  .rdp-day:not(.rdp-outside) {
    color: #f1f5f9; /* slate-100 */
  }

  .rdp-day_selected {
    background-color: #475569 !important; /* slate-600 */
    color: #f1f5f9 !important; /* slate-100 */
    font-weight: 600;
  }

  .rdp-day_selected:hover {
    background-color: #475569 !important; /* slate-600 */
  }

  .rdp-day:hover:not(.rdp-day_outside) {
    background-color: #1e293b; /* slate-800 */
    color: #f1f5f9; /* slate-100 */
  }
`;

export function CreateTask({
  project,
  createTask,
  setIsCreatingTask,
}: CreateTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask(
      project.id,
      title.trim(),
      description.trim(),
      "Todo",
      selectedDate ? new Date(selectedDate).getTime() : null,
      null
    );
    setIsCreatingTask(false);
  };

  return (
    <>
      <style>{css}</style>
      <Modal
        open={true}
        onOpenChange={(open) => !open && setIsCreatingTask(false)}
        title={
          <div className="flex items-center gap-2">
            <span>{project.emoji}</span>
            <span>New task in {project.name}</span>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-2 py-1.5 bg-slate-900 text-slate-100 text-sm rounded placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-600 transition-colors"
              autoFocus
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-2 py-1.5 bg-slate-900 text-slate-200 text-sm rounded placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-700 transition-colors resize-none"
              rows={4}
            />
          </div>
          <div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full px-2 py-1.5 bg-slate-900 text-slate-100 text-sm rounded hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-600 transition-colors flex items-center gap-2"
              >
                <Calendar size={14} className="text-slate-500" />
                {selectedDate
                  ? format(selectedDate, "MMM d, yyyy")
                  : "No due date"}
              </button>
              {showDatePicker && (
                <div className="absolute left-0 top-full mt-1 z-50">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setShowDatePicker(false);
                    }}
                    showOutsideDays
                    className="bg-slate-900"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsCreatingTask(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-plum text-white text-xs rounded hover:bg-plum/80 transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
