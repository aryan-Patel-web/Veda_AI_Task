// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { BookOpen, Home, Library, Sparkles } from "lucide-react"
// import { cn } from "@/lib/utils"

// const navItems = [
//   { label: "Home", href: "/", icon: Home },
//   { label: "Assignments", href: "/assignments", icon: BookOpen },
//   { label: "Library", href: "/library", icon: Library },
//   { label: "AI Toolkit", href: "/toolkit", icon: Sparkles },
// ]

// export function MobileNav() {
//   const pathname = usePathname()

//   return (
//     <nav className="fixed right-3 bottom-3 left-3 z-30 flex items-center justify-around rounded-[22px] border border-gray-200 bg-white px-3 py-2.5 text-gray-700 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:hidden">
//       {navItems.map((item) => {
//         const Icon = item.icon
//         const isActive =
//           item.href === "/assignments"
//             ? pathname.startsWith("/assignments")
//             : pathname === item.href

//         return (
//           <Link
//             key={item.label}
//             href={item.href}
//             className={cn(
//               "flex flex-col items-center gap-1 text-xs",
//               isActive ? "text-gray-900" : "text-gray-400"
//             )}
//           >
//             <Icon className="size-4" />
//             {item.label}
//           </Link>
//         )
//       })}
//     </nav>
//   )
// }


"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Home, Library, Sparkles } from "lucide-react"
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
    <nav className="fixed right-0 bottom-0 left-0 z-30 border-t border-gray-800 bg-[#1c1c1e] md:hidden">
      <div className="flex items-center justify-around px-2 py-2 pb-4">
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
              className="flex flex-col items-center gap-1 px-3 py-1.5"
            >
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-[10px] transition",
                  isActive ? "bg-white/10" : ""
                )}
              >
                <Icon
                  className={cn(
                    "size-[20px]",
                    isActive ? "text-white" : "text-gray-500"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-white" : "text-gray-500"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}