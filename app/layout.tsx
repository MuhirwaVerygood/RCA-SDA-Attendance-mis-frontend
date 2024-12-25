"use client";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./StoreProvider";
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

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          {!hideLayout && <Navbar />}
          <SidebarProvider>
            {!hideLayout ? (
              <div
                className="flex flex-row w-full overflow-hidden"
                style={{ height: "calc(100vh - 40px)", marginTop: "40px" }}
              >
                <div className="w-[20%]   bg-green-400">
                  <AppSidebar />
                </div>
                <main className="w-full h-full ">{children}</main>
              </div>
            ) : (
              <main className="w-full h-screen bg-white">{children}</main>
            )}
          </SidebarProvider>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
