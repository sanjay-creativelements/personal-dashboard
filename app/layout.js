import { Geist_Mono, Poppins, Caveat } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800", "900"],
  variable: "--font-poppins",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-caveat",
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
      <body className={`${poppins.className} ${geistMono.variable} ${caveat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
