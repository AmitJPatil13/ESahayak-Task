import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Users, Plus, Home } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Buyer Lead Intake",
  description: "Manage buyer leads efficiently with modern interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen`}>
        <nav className="glass-card sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <Link href="/" className="flex items-center gap-3 text-2xl font-bold gradient-text hover:scale-105 transition-transform">
                  <Home className="w-8 h-8 text-primary" />
                  ESahayak
                </Link>
              </div>
              <div className="flex items-center space-x-6">
                <Link
                  href="/buyers"
                  className="flex items-center gap-2 text-white/80 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                >
                  <Users className="w-5 h-5" />
                  All Buyers
                </Link>
                <Link
                  href="/buyers/new"
                  className="btn-primary flex items-center gap-2 px-6 py-3"
                >
                  <Plus className="w-5 h-5" />
                  Add Buyer
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="glass-card mt-16 border-t border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-secondary">
              <p>&copy; 2024 ESahayak - Premium Buyer Lead Management. Built with Next.js & Tailwind CSS.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
