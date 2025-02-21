import type { Metadata } from "next";
import { AuthProvider } from "../Context/AuthContext"; 
import "./globals.css";



export const metadata: Metadata = {
  title: "My ToDo App",
  description: "Firebase Google Auth with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> {/* Wrap with AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
