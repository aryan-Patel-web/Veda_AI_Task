"use client"

import { Bell, ChevronDown, ChevronLeft, Layout } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/auth-store"

type TopBarProps = {
  breadcrumbLabel: string
  onBackHref?: string
}

export function TopBar({ breadcrumbLabel }: TopBarProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const clearUser = useAuthStore((state) => state.clearUser)
  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Teacher"
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error(error)
    } finally {
      clearUser()
      router.push("/signin")
      router.refresh()
    }
  }

  return (
    <div className="mb-5 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-[#f6f6f6] text-gray-600 transition hover:text-gray-900"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Layout className="size-4 text-gray-400" />
          <span>{breadcrumbLabel}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-full border border-gray-200 bg-[#f6f6f6] text-gray-600 transition hover:text-gray-900"
        >
          <Bell className="size-5" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-orange-500"></span>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 shadow-sm transition hover:text-gray-600">
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block">{displayName}</span>
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
