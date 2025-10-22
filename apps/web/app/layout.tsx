import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Circles",
  description: "Community Circles web app"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
