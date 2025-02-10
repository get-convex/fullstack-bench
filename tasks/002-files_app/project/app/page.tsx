"use client";

export default function HomePage() {
  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-4">
          Welcome to Files Workspace
        </h1>
        <p className="text-slate-400 mb-8">
          Select a project from the sidebar to get started.
        </p>
      </div>
    </div>
  );
}
