"use client"

import { Bell, Menu } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VedaLogo } from "@/components/veda/logo"

export function MobileTopBar() {
  return (
    <div className="mx-3 mt-3 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.06)] md:hidden">
      <VedaLogo />
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-[#f6f6f6] text-gray-600"
        >
          <Bell className="size-4" />
        </button>
        <Avatar className="size-7 ring-1 ring-black/5">
          <AvatarFallback>TS</AvatarFallback>
        </Avatar>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-[#f6f6f6] text-gray-600"
        >
          <Menu className="size-4" />
        </button>
      </div>
    </div>
  )
}
