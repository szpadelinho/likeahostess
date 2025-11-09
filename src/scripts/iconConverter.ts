import * as LucideIcons from "lucide-react"
import { createLucideIcon } from "lucide-react"
import * as LucideLab from "@lucide/lab"

export function iconConverter(name: string) {
    const normalized = name.charAt(0).toUpperCase() + name.slice(1)
    const ReactIcon = (LucideIcons as any)[normalized]
    if (ReactIcon) return ReactIcon

    const LabIconData = (LucideLab as any)[name]
    if (LabIconData) {
        return createLucideIcon(
            name.charAt(0).toUpperCase() + name.slice(1),
            LabIconData
        )
    }

    return (LucideIcons as any).UtensilsCrossed
}
