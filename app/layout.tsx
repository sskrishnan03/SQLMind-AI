import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://sqlmind.ai");

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SQLMind AI — Generate SQL from plain English in seconds",
    template: "%s · SQLMind AI",
  },
  description:
    "Turn plain English into optimized, explained, and dialect-aware SQL queries instantly. PostgreSQL, MySQL, SQLite, Oracle, SQL Server, MariaDB, and MongoDB.",
  keywords: [
    "AI SQL generator",
    "text to SQL",
    "natural language to SQL",
    "SQL query builder",
    "SQL optimizer",
  ],
  openGraph: {
    title: "SQLMind AI — Generate SQL from plain English in seconds",
    description:
      "Turn plain English into optimized, explained, and dialect-aware SQL queries instantly.",
    url: BASE_URL,
    siteName: "SQLMind AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQLMind AI — Generate SQL from plain English in seconds",
    description:
      "Turn plain English into optimized, explained, and dialect-aware SQL queries instantly.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-background font-sans text-white antialiased selection:bg-accent/40">
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              color: "white",
            },
          }}
        />
      </body>
    </html>
  );
}
