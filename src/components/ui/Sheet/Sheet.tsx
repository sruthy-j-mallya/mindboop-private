import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

const Sheet = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) => {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

export default Sheet
