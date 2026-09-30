import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

const TooltipTrigger = ({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) => {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

export default TooltipTrigger
