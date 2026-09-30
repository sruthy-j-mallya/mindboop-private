import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

const SheetClose = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) => {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

export default SheetClose
