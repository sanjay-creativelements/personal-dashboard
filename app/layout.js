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
    <html lang="en">
      <body className={`${poppins.className} ${geistMono.variable} ${caveat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}