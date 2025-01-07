"use client";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { FamiliesProvider } from "./contexts/FamiliesContext";
import StoreProvider from "./StoreProvider";
import { useState } from "react";
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
  const pathname = usePathname();
  const hideLayout = pathname === "/" || pathname === "/signup";
  const [showSidebar, setShowSidebar] = useState<boolean>(true)
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <html lang="en">
      <StoreProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          {!hideLayout && <Navbar />}
          <SidebarProvider>
            {!hideLayout ? (
              <div
                className="flex flex-row w-full overflow-hidden"
                style={{ height: "calc(100vh - 40px)", marginTop: "40px" }}
              >
                <div className={`${showSidebar ? "w-20%" : "w-0"} bg-green-400`}>
                  <AppSidebar />
                </div>

                <main 
                  className="h-full transition-all duration-300  w-full"
                >
                  <FamiliesProvider >
                    <SidebarTrigger onClick={toggleSidebar} />
                    {children}
                </FamiliesProvider>
                </main>

              </div>
            ) : (
              <main className="w-full h-screen bg-white">{children}</main>
            )}
          </SidebarProvider>
          <Toaster />
      </body>
        </StoreProvider>
    </html>
  );
}
