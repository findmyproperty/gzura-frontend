import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import GoogleAuthProvider from "@/components/provider/google-auth-provider";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  title: "GZURA | Empowering Men & Women Entrepreneurs",
  description:
    "GZURA is a platform dedicated to entrepreneurship, leadership development, networking, and personal growth.",
  keywords: [
    "entrepreneurship",
    "leadership development",
    "networking",
    "personal growth",
    "business growth",
    "community building",
    "women entrepreneurs",
    "men entrepreneurs",
    "mentorship",
  ],
  authors: [{ name: "GZURA" }],
  openGraph: {
    title: "GZURA | Empowering Men & Women Entrepreneurs",
    description:
      "GZURA is a platform dedicated to entrepreneurship, leadership development, networking, and personal growth.",
    type: "website",
    locale: "en_US",
    siteName: "GZURA",
  },
  twitter: {
    card: "summary_large_image",
    title: "GZURA | Empowering Men & Women Entrepreneurs",
    description:
      "GZURA is a platform dedicated to entrepreneurship, leadership development, networking, and personal growth.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <GoogleAuthProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
