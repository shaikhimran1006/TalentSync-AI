import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, Sora } from "next/font/google";

import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = Sora({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "TalentSync AI",
  description: "AI hiring intelligence platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} dark`}>
      <body>
        <div className="flex min-h-screen bg-slate-950">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <Topbar />
            <main className="flex-1 space-y-8 px-6 py-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
