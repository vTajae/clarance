import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { JotaiProvider } from "@/components/providers/jotai-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SF-86 | Questionnaire for National Security Positions",
  description:
    "Secure web interface for completing the SF-86 questionnaire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <JotaiProvider>{children}</JotaiProvider>
      </body>
    </html>
  );
}
