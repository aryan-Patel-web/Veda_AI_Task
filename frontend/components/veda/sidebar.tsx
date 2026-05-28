// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import {
//   BookOpen,
//   Home,
//   Library,
//   Settings,
//   Sparkles,
//   Users,
//   Plus,
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { VedaLogo } from "@/components/veda/logo"
// import { useAuthStore } from "@/lib/auth-store"

// const navItems = [
//   { label: "Home", href: "/", icon: Home },
//   { label: "My Groups", href: "/groups", icon: Users },
//   { label: "Assignments", href: "/assignments", icon: BookOpen },
//   { label: "AI Teacher's Toolkit", href: "/toolkit", icon: Sparkles },
//   { label: "My Library", href: "/library", icon: Library },
// ]

// export function Sidebar() {
//   const pathname = usePathname()
//   const user = useAuthStore((state) => state.user)
//   const status = useAuthStore((state) => state.status)
//   const displayName = user
//     ? `${user.firstName} ${user.lastName}`.trim()
//     : status === "loading"
//       ? "Loading..."
//       : "Not signed in"
//   const email = user?.email ?? ""
//   const initials = displayName
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase())
//     .join("")

//   return (
//     <aside className="hidden md:fixed md:top-4 md:bottom-4 md:left-4 md:z-40 md:flex md:w-[220px] md:flex-col md:rounded-[28px] md:border md:border-gray-200 md:bg-white md:shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
//       <div className="px-5 py-6">
//         <VedaLogo />

//         <Button
//           asChild
//           className="mt-5 h-10 w-full rounded-full border border-orange-400 bg-[#111111] text-sm font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.18)] hover:bg-[#1a1a1a]"
//         >
//           <Link href="/assignments/create">
//             <Plus className="mr-2 size-4" />
//             Create Assignment
//           </Link>
//         </Button>
//       </div>

//       <nav className="flex-1 space-y-1 overflow-y-auto px-3">
//         {navItems.map((item) => {
//           const Icon = item.icon
//           const isActive =
//             item.href === "/assignments"
//               ? pathname.startsWith("/assignments")
//               : pathname === item.href

//           return (
//             <Link
//               key={item.label}
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
//                 isActive
//                   ? "bg-[#f3f3f3] text-gray-900 shadow-[0_6px_14px_rgba(0,0,0,0.06)]"
//                   : "text-gray-500 hover:text-gray-900"
//               )}
//             >
//               <Icon className="size-[18px]" />
//               <span>{item.label}</span>
//             </Link>
//           )
//         })}
//       </nav>

//       <div className="space-y-4 border-t border-gray-100 px-3 py-6">
//         <Link
//           href="/settings"
//           className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-500 transition hover:text-gray-900"
//         >
//           <Settings className="size-[18px]" />
//           <span>Settings</span>
//         </Link>

//         <div className="space-y-2 rounded-2xl bg-[#f6f6f6] p-3">
//           <Avatar className="size-10 rounded-full ring-2 ring-white">
//             <AvatarFallback>{initials || "U"}</AvatarFallback>
//           </Avatar>
//           <div>
//             <p className="text-sm font-semibold text-gray-900">{displayName}</p>
//             {email ? <p className="text-xs text-gray-500">{email}</p> : null}
//           </div>
//         </div>
//       </div>
//     </aside>
//   )
// }


"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Home,
  Library,
  Settings,
  Sparkles,
  Users,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { VedaLogo } from "@/components/veda/logo"
import { useAuthStore } from "@/lib/auth-store"

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "My Groups", href: "/groups", icon: Users },
  { label: "Assignments", href: "/assignments", icon: BookOpen, badge: 10 },
  { label: "AI Teacher's Toolkit", href: "/toolkit", icon: Sparkles },
  { label: "My Library", href: "/library", icon: Library },
]

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : status === "loading"
      ? "Loading..."
      : "Delhi Public School"

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return (
    <aside className="hidden md:fixed md:top-4 md:bottom-4 md:left-4 md:z-40 md:flex md:w-[220px] md:flex-col md:rounded-[28px] md:border md:border-gray-200 md:bg-white md:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <VedaLogo />

        {/* Create Assignment button */}
        <Link
          href="/assignments/create"
          className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#E8793A] bg-[#1a1a1a] text-sm font-semibold text-white shadow-[0_6px_20px_rgba(249,115,22,0.28)] transition hover:bg-[#111111]"
        >
          <Plus className="size-[15px]" />
          Create Assignment
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
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
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-[9px] text-sm font-medium transition",
                isActive
                  ? "bg-[#f3f3f3] text-gray-900"
                  : "text-gray-500 hover:bg-[#f8f8f8] hover:text-gray-800"
              )}
            >
              <Icon
                className={cn(
                  "size-[17px] flex-shrink-0",
                  isActive ? "text-gray-800" : "text-gray-400"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F97316] px-1.5 text-[11px] font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: Settings + School card */}
      <div className="border-t border-gray-100 px-3 pb-5 pt-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-[9px] text-sm text-gray-500 transition hover:bg-[#f8f8f8] hover:text-gray-800"
        >
          <Settings className="size-[17px] flex-shrink-0 text-gray-400" />
          <span>Settings</span>
        </Link>

        <div className="mt-2 flex items-center gap-3 rounded-2xl bg-[#f5f5f5] px-3 py-3">
          <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-[#e8e8e8] text-[13px] font-bold text-gray-600 ring-2 ring-white">
            {initials || "DP"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-gray-900">
              {displayName || "Delhi Public School"}
            </p>
            <p className="truncate text-[11px] text-gray-400">
              {user?.email || "Bokaro Steel City"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}