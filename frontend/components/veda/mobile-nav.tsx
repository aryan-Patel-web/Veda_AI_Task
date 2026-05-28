"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Home,
  Library,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Assignments", href: "/assignments", icon: BookOpen },
  { label: "Library", href: "/library", icon: Library },
  { label: "AI Toolkit", href: "/toolkit", icon: Sparkles },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed right-3 bottom-3 left-3 z-30 flex items-center justify-around rounded-[24px] bg-[#111111] px-3 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.35)] lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon

        const isActive =
          item.href === "/assignments"
            ? pathname.startsWith("/assignments")
            : pathname === item.href

        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1"
          >
            <Icon
              className={cn(
                "size-4 transition-colors",
                isActive ? "text-white" : "text-gray-500"
              )}
            />

            <span
              className={cn(
                "text-[11px] font-medium transition-colors",
                isActive ? "text-white" : "text-gray-500"
              )}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}