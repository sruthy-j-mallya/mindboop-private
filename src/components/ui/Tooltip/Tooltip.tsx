import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

const Tooltip = ({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

export default Tooltip
