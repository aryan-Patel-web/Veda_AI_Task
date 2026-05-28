// "use client"

// import { Bell, Menu } from "lucide-react"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { VedaLogo } from "@/components/veda/logo"

// export function MobileTopBar() {
//   return (
//     <div className="mx-3 mt-3 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.06)] md:hidden">
//       <VedaLogo />
//       <div className="flex items-center gap-3">
//         <button
//           type="button"
//           className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-[#f6f6f6] text-gray-600"
//         >
//           <Bell className="size-4" />
//         </button>
//         <Avatar className="size-7 ring-1 ring-black/5">
//           <AvatarFallback>TS</AvatarFallback>
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

import { Bell, Menu } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VedaLogo } from "@/components/veda/logo"
import { useAuthStore } from "@/lib/auth-store"

export function MobileTopBar() {
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
    <div className="mx-3 mt-3 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.06)] lg:hidden">
      <VedaLogo />

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-full border border-gray-200 bg-[#f6f6f6] text-gray-600"
        >
          <Bell className="size-4" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-orange-500"></span>
        </button>

        <Avatar className="size-8 ring-1 ring-black/5">
          <AvatarFallback>{initials || "U"}</AvatarFallback>
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