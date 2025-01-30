"use client";

import * as Popover from "@radix-ui/react-popover";
import { Calendar, Clock, User } from "lucide-react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse } from "date-fns";
import { Task } from "../lib/types";

const statusColors = {
  Todo: "bg-gray-400",
  "In Progress": "bg-blue-400",
  "In Review": "bg-purple-400",
  Done: "bg-green-400",
  Canceled: "bg-red-400",
};

interface TaskDetailsProps {
  task: Task;
  updateTaskStatus: (taskId: string, status: Task["status"]) => void;
  updateTaskAssignee: (taskId: string, assigneeId: string | null) => void;
  updateTaskDueDate: (taskId: string, dueDate: string) => void;
}

const css = `
  .rdp {
    --rdp-cell-size: 32px;
    --rdp-accent-color: #4A4A4A;
    --rdp-background-color: #242424;
    --rdp-accent-color-dark: #E1E1E1;
    --rdp-background-color-dark: #1A1A1A;
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
    border-bottom: 1px solid #242424;
  }

  .rdp-caption_label {
    font-size: 0.875rem;
    color: #E1E1E1;
    font-weight: 500;
  }

  .rdp-button_previous,
  .rdp-button_next {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    color: #8A8A8A;
  }

  .rdp-button_previous:hover,
  .rdp-button_next:hover {
    color: #E1E1E1;
    background-color: #242424;
  }

  .rdp-nav {
    color: #8A8A8A;
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
    color: #E1E1E1;
    text-transform: uppercase;
    padding-bottom: 0.75rem;
  }

  .rdp-tbody {
    margin-top: 0.5rem;
  }

  .rdp-cell {
    color: #8A8A8A;
  }

  .rdp-day {
    color: #8A8A8A;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    font-size: 0.875rem;
    text-align: center;
  }

  .rdp-weekday {
    color: #8A8A8A;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
  }

  .rdp-day_today {
    color: #E1E1E1;
    font-weight: 600;
    background-color: #242424;
  }

  .rdp-day:not(.rdp-outside) {
    color: #E1E1E1;
  }

  .rdp-day_selected {
    background-color: #4A4A4A !important;
    color: #E1E1E1 !important;
    font-weight: 600;
  }

  .rdp-day_selected:hover {
    background-color: #4A4A4A !important;
  }

  .rdp-day:hover:not(.rdp-day_outside) {
    background-color: #242424;
    color: #E1E1E1;
  }
`;

export function TaskDetails({
  task,
  updateTaskStatus,
  updateTaskAssignee,
  updateTaskDueDate,
}: TaskDetailsProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [dueDateOpen, setDueDateOpen] = useState(false);

  const selectedDate = task.dueDate
    ? parse(task.dueDate, "yyyy-MM-dd", new Date())
    : undefined;

  return (
    <>
      <style>{css}</style>
      <div className="w-[240px] border-l border-[#1A1A1A] p-4 space-y-4">
        <div>
          <h2 className="text-xs font-medium text-[#8A8A8A] uppercase mb-2">
            Status
          </h2>
          <Popover.Root open={statusOpen} onOpenChange={setStatusOpen}>
            <Popover.Trigger asChild>
              <button className="w-full px-2 py-1.5 bg-[#1A1A1A] text-[#E1E1E1] text-sm rounded hover:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-[#4A4A4A] transition-colors flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    statusColors[task.status]
                  }`}
                />
                {task.status}
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="w-[200px] bg-[#1A1A1A] rounded-md shadow-lg p-1 z-50"
                sideOffset={5}
              >
                {Object.keys(statusColors).map((status) => (
                  <Popover.Close key={status} asChild>
                    <button
                      className={`w-full px-2 py-1.5 text-sm rounded flex items-center gap-2 hover:bg-[#242424] transition-colors ${
                        task.status === status ? "text-white" : "text-[#8A8A8A]"
                      }`}
                      onClick={() => {
                        updateTaskStatus(task.taskId, status as Task["status"]);
                      }}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          statusColors[status as keyof typeof statusColors]
                        }`}
                      />
                      {status}
                    </button>
                  </Popover.Close>
                ))}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>

        <div>
          <h2 className="text-xs font-medium text-[#8A8A8A] uppercase mb-2">
            Assignee
          </h2>
          <Popover.Root open={assigneeOpen} onOpenChange={setAssigneeOpen}>
            <Popover.Trigger asChild>
              <button className="w-full px-2 py-1.5 bg-[#1A1A1A] text-[#E1E1E1] text-sm rounded hover:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-[#4A4A4A] transition-colors flex items-center gap-2">
                <User size={14} className="text-[#8A8A8A]" />
                {task.assigneeId || "Unassigned"}
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="w-[200px] bg-[#1A1A1A] rounded-md shadow-lg p-1 z-50"
                sideOffset={5}
              >
                <Popover.Close asChild>
                  <button
                    className={`w-full px-2 py-1.5 text-sm rounded flex items-center gap-2 hover:bg-[#242424] transition-colors ${
                      !task.assigneeId ? "text-white" : "text-[#8A8A8A]"
                    }`}
                    onClick={() => updateTaskAssignee(task.taskId, null)}
                  >
                    <User size={14} />
                    Unassigned
                  </button>
                </Popover.Close>
                <Popover.Close asChild>
                  <button
                    className={`w-full px-2 py-1.5 text-sm rounded flex items-center gap-2 hover:bg-[#242424] transition-colors ${
                      task.assigneeId === "user123"
                        ? "text-white"
                        : "text-[#8A8A8A]"
                    }`}
                    onClick={() => updateTaskAssignee(task.taskId, "user123")}
                  >
                    <User size={14} />
                    user@example.com
                  </button>
                </Popover.Close>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>

        <div>
          <h2 className="text-xs font-medium text-[#8A8A8A] uppercase mb-2">
            <div className="flex items-center gap-2">
              <Clock size={12} />
              Due Date
            </div>
          </h2>
          <Popover.Root open={dueDateOpen} onOpenChange={setDueDateOpen}>
            <Popover.Trigger asChild>
              <button className="w-full px-2 py-1.5 bg-[#1A1A1A] text-[#E1E1E1] text-sm rounded hover:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-[#4A4A4A] transition-colors flex items-center gap-2">
                <Calendar size={14} className="text-[#8A8A8A]" />
                {task.dueDate
                  ? format(selectedDate!, "MMM d, yyyy")
                  : "No due date"}
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="bg-[#1A1A1A] rounded-md shadow-lg p-3 z-50"
                sideOffset={5}
              >
                <div className="space-y-2">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        updateTaskDueDate(
                          task.taskId,
                          format(date, "yyyy-MM-dd")
                        );
                        setDueDateOpen(false);
                      }
                    }}
                    showOutsideDays
                    className="bg-[#1A1A1A]"
                  />
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </>
  );
}
