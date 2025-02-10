import { BackendContext } from "@/lib/BackendContext";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat App",
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
