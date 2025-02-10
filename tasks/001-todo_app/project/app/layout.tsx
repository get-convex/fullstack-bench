import { BackendContext } from "@/lib/BackendContext";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "TODO App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950">
        <BackendContext>{children}</BackendContext>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#334155",
              color: "#e2e8f0",
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
