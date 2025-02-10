import { BackendContext } from "@/lib/BackendContext";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ProjectSidebar } from "./ProjectSidebar";

export const metadata: Metadata = {
  title: "Files Workspace",
  description: "A collaborative file management workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950">
        <BackendContext>
          <div className="flex h-screen">
            <ProjectSidebar />
            {/* Main Content Area */}
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </BackendContext>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgb(30 41 59)",
              color: "rgb(226 232 240)",
              borderRadius: "6px",
            },
            error: {
              duration: 4000,
            },
          }}
        />
      </body>
    </html>
  );
}
