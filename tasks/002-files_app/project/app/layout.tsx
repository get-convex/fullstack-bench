import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { SetupContext } from "@/components/SetupContext";
import { WithUserEmail } from "@/components/WithUserEmail";
import { Toaster } from "react-hot-toast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SetupContext>
          <WithUserEmail>
            <div className="flex h-screen">
              <Sidebar />
              {/* Main Content Area */}
              <div className="flex-1 overflow-auto">{children}</div>
            </div>
          </WithUserEmail>
        </SetupContext>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#26262b",
              color: "#E1E1E3",
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
