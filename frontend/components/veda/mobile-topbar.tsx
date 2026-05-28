// // "use client"

// // import { Bell, Menu } from "lucide-react"
// // import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// // import { VedaLogo } from "@/components/veda/logo"

// // export function MobileTopBar() {
// //   return (
// //     <div className="mx-3 mt-3 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.06)] md:hidden">
// //       <VedaLogo />
// //       <div className="flex items-center gap-3">
// //         <button
// //           type="button"
// //           className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-[#f6f6f6] text-gray-600"
// //         >
// //           <Bell className="size-4" />
// //         </button>
// //         <Avatar className="size-7 ring-1 ring-black/5">
// //           <AvatarFallback>TS</AvatarFallback>
// //         </Avatar>
// //         <button
// //           type="button"
// //           className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-[#f6f6f6] text-gray-600"
// //         >
// //           <Menu className="size-4" />
// //         </button>
// //       </div>
// //     </div>
// //   )
// // }







// "use client"

// import { Bell, Menu } from "lucide-react"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { VedaLogo } from "@/components/veda/logo"
// import { useAuthStore } from "@/lib/auth-store"

// export function MobileTopBar() {
//   const user = useAuthStore((state) => state.user)

//   const displayName = user
//     ? `${user.firstName} ${user.lastName}`.trim()
//     : "User"

//   const initials = displayName
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase())
//     .join("")

//   return (
//     <div className="mx-3 mt-3 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.06)] lg:hidden">
//       <VedaLogo />

//       <div className="flex items-center gap-3">
//         <button
//           type="button"
//           className="relative flex size-9 items-center justify-center rounded-full border border-gray-200 bg-[#f6f6f6] text-gray-600"
//         >
//           <Bell className="size-4" />
//           <span className="absolute top-1 right-1 size-2 rounded-full bg-orange-500"></span>
//         </button>

//         <Avatar className="size-8 ring-1 ring-black/5">
//           <AvatarFallback>{initials || "U"}</AvatarFallback>
//         </Avatar>

//         <button
//           type="button"
//           className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-[#f6f6f6] text-gray-600"
//         >
//           <Menu className="size-4" />
//         </button>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import Link from "next/link"

import {
  Bell,
  BookOpen,
  Home,
  Library,
  Menu,
  Sparkles,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VedaLogo } from "@/components/veda/logo"
import { useAuthStore } from "@/lib/auth-store"

const menuItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Assignments",
    href: "/assignments",
    icon: BookOpen,
  },
  {
    label: "Library",
    href: "/library",
    icon: Library,
  },
  {
    label: "AI Toolkit",
    href: "/toolkit",
    icon: Sparkles,
  },
]

export function MobileTopBar() {
  const [open, setOpen] = useState(false)

  const user = useAuthStore((state) => state.user)

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "User"

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return (
    <>
      {/* Topbar */}
      <div className="mx-3 mt-3 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.06)] lg:hidden">
        <VedaLogo />

        <div className="flex items-center gap-3">
          {/* Notification */}
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-full border border-gray-200 bg-[#f6f6f6] text-gray-600"
          >
            <Bell className="size-4" />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-orange-500"></span>
          </button>

          {/* Avatar */}
          <Avatar className="size-8 ring-1 ring-black/5">
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>

          {/* Menu Button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-[#f6f6f6] text-gray-600"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <VedaLogo />



          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex size-9 items-center justify-center rounded-full border border-gray-200"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100"
              >
                <Icon className="size-5" />

                <span className="font-medium">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}