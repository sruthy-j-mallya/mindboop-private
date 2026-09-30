import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/Input"

const SidebarInput = ({
  className,
  ...props
}: React.ComponentProps<typeof Input>) => {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("h-8 w-full bg-background shadow-none", className)}
      {...props}
    />
  )
}

export default SidebarInput
