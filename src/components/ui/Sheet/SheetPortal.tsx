import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

const SheetPortal = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) => {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

export default SheetPortal
