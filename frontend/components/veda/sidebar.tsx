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
    <>
      {/* Desktop sidebar */}
      <aside
        style={{
          position: "fixed",
          top: "16px",
          bottom: "16px",
          left: "16px",
          width: "220px",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          borderRadius: "28px",
          border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          boxShadow: "0 18px 45px rgba(0,0,0,0.10)",
        }}
        className="hidden md:flex"
      >
        {/* Logo + CTA */}
        <div style={{ padding: "24px 20px 16px" }}>
          <VedaLogo />
          <Link
            href="/assignments/create"
            style={{
              marginTop: "20px",
              display: "flex",
              height: "40px",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              borderRadius: "9999px",
              border: "1px solid #E8793A",
              backgroundColor: "#1a1a1a",
              fontSize: "14px",
              fontWeight: 600,
              color: "#ffffff",
              boxShadow: "0 6px 20px rgba(249,115,22,0.28)",
              textDecoration: "none",
            }}
          >
            <Plus style={{ width: "15px", height: "15px" }} />
            Create Assignment
          </Link>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  borderRadius: "12px",
                  padding: "9px 12px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  marginBottom: "2px",
                  backgroundColor: isActive ? "#f3f3f3" : "transparent",
                  color: isActive ? "#111827" : "#6b7280",
                }}
              >
                <Icon
                  style={{
                    width: "17px",
                    height: "17px",
                    flexShrink: 0,
                    color: isActive ? "#374151" : "#9ca3af",
                  }}
                />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span
                    style={{
                      display: "flex",
                      height: "20px",
                      minWidth: "20px",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "9999px",
                      backgroundColor: "#F97316",
                      padding: "0 6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#ffffff",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom: Settings + School card */}
        <div
          style={{
            borderTop: "1px solid #f3f4f6",
            padding: "12px 12px 20px",
          }}
        >
          <Link
            href="/settings"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderRadius: "12px",
              padding: "9px 12px",
              fontSize: "14px",
              color: "#6b7280",
              textDecoration: "none",
            }}
          >
            <Settings style={{ width: "17px", height: "17px", color: "#9ca3af" }} />
            <span>Settings</span>
          </Link>

          {/* School profile card */}
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderRadius: "16px",
              backgroundColor: "#f5f5f5",
              padding: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "40px",
                height: "40px",
                flexShrink: 0,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9999px",
                backgroundColor: "#e8e8e8",
                fontSize: "13px",
                fontWeight: 700,
                color: "#4b5563",
                boxShadow: "0 0 0 2px white",
              }}
            >
              {initials || "DP"}
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#111827",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName || "Delhi Public School"}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email || "Bokaro Steel City"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}