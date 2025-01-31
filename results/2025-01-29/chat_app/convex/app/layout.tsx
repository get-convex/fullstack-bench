import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { WithLogin } from "@/components/LoginForm";
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
  title: "Chat App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <WithLogin>
            {children}
          </WithLogin>
        </ConvexClientProvider>
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#26262b',
            color: '#E1E1E3',
            borderRadius: '6px',
          },
          error: {
            duration: 4000,
          }
        }} />
      </body>
    </html>
  );
}
