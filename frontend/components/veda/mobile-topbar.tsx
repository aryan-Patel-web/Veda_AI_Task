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
  const initials = user
    ? `${user.firstName} ${user.lastName}`
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "TS"

  return (
    <div
      style={{
        margin: "12px 12px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        padding: "12px 16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
      }}
      className="md:hidden"
    >
      <VedaLogo />
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          type="button"
          style={{
            position: "relative",
            display: "flex",
            width: "36px",
            height: "36px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9999px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#f6f6f6",
            color: "#4b5563",
            cursor: "pointer",
          }}
        >
          <Bell style={{ width: "17px", height: "17px" }} />
          <span
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              width: "8px",
              height: "8px",
              borderRadius: "9999px",
              backgroundColor: "#F97316",
            }}
          />
        </button>
        <Avatar className="size-8" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.10)" }}>
          <AvatarFallback style={{ fontSize: "12px", fontWeight: 600 }}>{initials}</AvatarFallback>
        </Avatar>
        <button
          type="button"
          style={{
            display: "flex",
            width: "36px",
            height: "36px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9999px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#f6f6f6",
            color: "#4b5563",
            cursor: "pointer",
          }}
        >
          <Menu style={{ width: "17px", height: "17px" }} />
        </button>
      </div>
    </div>
  )
}