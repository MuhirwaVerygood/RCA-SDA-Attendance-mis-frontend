"use client"
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname()

  const isAdminPage  = pathname === "/admin-landing";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {isAdminPage && <Navbar  />}
        <SidebarProvider>
          {isAdminPage ? (
            <div className="flex flex-row w-full">
              <div className="w-[20%] ">
                <AppSidebar />
              </div>
              <main className="w-full">
                {children}
              </main>
            </div>
          ) :
            (
            <main className="w-full h-screen">
                {children}
              </main>
            )
          }
        </SidebarProvider>
      </body>
    </html>
  );
}
