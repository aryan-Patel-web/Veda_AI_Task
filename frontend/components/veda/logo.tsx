import Image from "next/image"
import { cn } from "@/lib/utils"

type VedaLogoProps = {
  className?: string
  textClassName?: string
  size?: "sm" | "md"
}

export function VedaLogo({
  className,
  textClassName,
  size = "md",
}: VedaLogoProps) {
  const isSmall = size === "sm"

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          isSmall ? "h-8 w-8" : "h-10 w-10"
        )}
      >
        <Image
          src="/veda/logo.png"
          alt="Veda AI Logo"
          fill
          priority
          className="object-cover"
        />
      </div>

      <span
        className={cn(
          "font-bold tracking-tight text-gray-900",
          isSmall ? "text-lg" : "text-[22px]",
          textClassName
        )}
      >
        VedaAI
      </span>
    </div>
  )
}