import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/app/components/ThemeToggle";
import FloatingOrbs from "@/app/components/FloatingOrbs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sanjay Waugh · Personal Dashboard",
  description: "Junior Builder at Creative Elements — projects, work, and more.",
  icons: {
    icon: "/favicon-round.png",
    apple: "/favicon-round.png",
  },
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning prevents React from warning when the inline
    // script adds .dark to <html> before hydration, causing a class mismatch.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs synchronously before first paint — reads localStorage and
            system preference, then applies .dark to <html> if needed.
            This prevents a flash of the wrong theme on page load. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <FloatingOrbs />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
