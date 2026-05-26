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
    <div className="min-h-svh bg-[#ededed]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#f7f7f7,_#ededed_58%,_#e4e4e4)]" />
      <Sidebar />
      <MobileTopBar />
      <div className="md:pl-[252px]">
        <main className="min-h-svh px-4 pt-4 pb-28 md:h-svh md:overflow-y-auto md:px-6 md:pt-6 md:pr-6">
          <div className="mx-auto w-full max-w-[1200px]">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
