import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

const SheetTrigger = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) => {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

export default SheetTrigger
