import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import type { Step } from "./types";

type SortableStepProps = {
  step: Step;
  position: number;
  onRemove: (id: string) => void;
};

const SortableStep = ({
  step: { id, text },
  position,
  onRemove,
}: SortableStepProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "relative flex items-center gap-3 rounded-xl bg-muted px-4 py-2.5",
        isDragging && "z-10 shadow-md",
      )}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        aria-label={`Reorder step ${text}`}
        className="-ml-2 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="size-4" />
      </button>
      <span className="flex-1 text-sm">{text}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Remove step ${text}`}
        onClick={() => onRemove(id)}
      >
        <XIcon />
      </Button>
    </li>
  );
};

export default SortableStep;
