import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduPlay 3D - Educational Gaming Platform",
  description: "Interactive 3D educational games for students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
