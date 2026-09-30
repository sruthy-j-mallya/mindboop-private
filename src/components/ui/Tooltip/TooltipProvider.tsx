import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

const TooltipProvider = ({
  delay = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) => {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

export default TooltipProvider
