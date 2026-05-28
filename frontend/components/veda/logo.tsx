// import { cn } from "@/lib/utils"

// type VedaLogoProps = {
//   className?: string
//   textClassName?: string
// }

// export function VedaLogo({ className, textClassName }: VedaLogoProps) {
//   return (
//     <div className={cn("flex items-center gap-2", className)}>
//       <div className="flex size-9 items-center justify-center rounded-xl bg-[#f97316] text-lg font-black text-white shadow-[0_8px_16px_rgba(249,115,22,0.35)]">
//         V
//       </div>
//       <span className={cn("text-xl font-bold text-gray-900", textClassName)}>
//         VedaAI
//       </span>
//     </div>
//   )
// }

import { cn } from "@/lib/utils"

type VedaLogoProps = {
  className?: string
  textClassName?: string
}

export function VedaLogo({ className, textClassName }: VedaLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex size-9 items-center justify-center rounded-[10px] bg-[#F97316] shadow-[0_4px_12px_rgba(249,115,22,0.40)]">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 5L10 15L16 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className={cn("text-[18px] font-bold tracking-tight text-gray-900", textClassName)}>
        VedaAI
      </span>
    </div>
  )
}