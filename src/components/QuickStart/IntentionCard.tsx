import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusIcon } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

import MarkdownEditor from "@common/MarkdownEditor";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import SortableStep from "./SortableStep";
import type { Step } from "./types";

type IntentionCardProps = {
  intention: string;
  description: string;
  steps: Step[];
  onIntentionChange: (intention: string) => void;
  onDescriptionChange: (description: string) => void;
  onAddStep: (text: string) => void;
  onRemoveStep: (id: string) => void;
  onReorderSteps: (activeId: string, overId: string) => void;
};

const IntentionCard = ({
  intention,
  description,
  steps,
  onIntentionChange,
  onDescriptionChange,
  onAddStep,
  onRemoveStep,
  onReorderSteps,
}: IntentionCardProps) => {
  const [draftStep, setDraftStep] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addStep = () => {
    const text = draftStep.trim();
    if (!text) return;

    onAddStep(text);
    setDraftStep("");
  };

  const handleStepKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    addStep();
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    onReorderSteps(String(active.id), String(over.id));
  };

  return (
    <div className="flex flex-col gap-5 rounded-3xl border bg-card p-6 md:p-8">
      <label htmlFor="intention" className="sr-only">
        Intention
      </label>
      <Input
        id="intention"
        value={intention}
        onChange={(event) => onIntentionChange(event.currentTarget.value)}
        placeholder="e.g. Draft the intro section of the grant proposal"
        className="h-auto min-h-10 rounded-none border-0 bg-transparent px-0 py-0 text-2xl font-semibold placeholder:text-muted-foreground/60 focus-visible:ring-0 md:text-3xl"
      />

      <MarkdownEditor
        value={description}
        onChange={onDescriptionChange}
        ariaLabel="Description"
        placeholder="Add a description — Markdown is supported"
        className="min-h-16"
      />

      {steps.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={steps} strategy={verticalListSortingStrategy}>
            <ol className="flex flex-col gap-2">
              {steps.map((step) => (
                <SortableStep
                  key={step.id}
                  step={step}
                  onRemove={onRemoveStep}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      )}

      <div className="flex gap-3">
        <Input
          aria-label="New step"
          value={draftStep}
          onChange={(event) => setDraftStep(event.currentTarget.value)}
          onKeyDown={handleStepKeyDown}
          placeholder="Add a step and press Enter"
          className="h-12 rounded-xl bg-card px-4"
        />
        <Button
          type="button"
          variant="ghost"
          aria-label="Add step"
          disabled={!draftStep.trim()}
          onClick={addStep}
          className="size-12 rounded-xl bg-muted text-primary [&_svg:not([class*='size-'])]:size-5"
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};

export default IntentionCard;
