import { cn } from "@/lib/utils"

type VedaLogoProps = {
  className?: string
  textClassName?: string
}

export function VedaLogo({ className, textClassName }: VedaLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex size-9 items-center justify-center rounded-xl bg-[#f97316] text-lg font-black text-white shadow-[0_8px_16px_rgba(249,115,22,0.35)]">
        V
      </div>
      <span className={cn("text-xl font-bold text-gray-900", textClassName)}>
        VedaAI
      </span>
    </div>
  )
}
