// import { Inter, Geist_Mono } from "next/font/google"

// import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
// import { cn } from "@/lib/utils"

// const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

// const fontMono = Geist_Mono({
//   subsets: ["latin"],
//   variable: "--font-mono",
// })

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html
//       lang="en"
//       suppressHydrationWarning
//       className={cn(
//         "antialiased",
//         fontMono.variable,
//         "font-sans",
//         inter.variable
//       )}
//     >
//       <body>
//         <ThemeProvider>{children}</ThemeProvider>
//       </body>
//     </html>
//   )
// }

"use client"

import { useEffect } from "react"
import { Sidebar } from "@/components/veda/sidebar"
import { MobileNav } from "@/components/veda/mobile-nav"
import { MobileTopBar } from "@/components/veda/mobile-topbar"
import { useAuthStore } from "@/lib/auth-store"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const loadUser = useAuthStore((state) => state.loadUser)

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return (
    <div className="min-h-svh bg-[#ebebeb]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_#f5f5f5,_#ebebeb_55%,_#e2e2e2)]" />
      <Sidebar />
      <MobileTopBar />
      <div className="md:pl-[252px]">
        <main className="min-h-svh px-4 pt-4 pb-28 md:h-svh md:overflow-y-auto md:px-6 md:pt-6 md:pb-6">
          <div className="mx-auto w-full max-w-[1200px]">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}