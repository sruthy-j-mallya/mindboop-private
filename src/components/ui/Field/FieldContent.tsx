import * as React from "react"

import { cn } from "@/lib/utils"

const FieldContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
        className
      )}
      {...props}
    />
  )
}

export default FieldContent
