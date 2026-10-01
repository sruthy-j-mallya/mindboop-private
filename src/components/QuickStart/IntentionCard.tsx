import { PlusIcon, XIcon } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import type { Step } from "./types";

type IntentionCardProps = {
  intention: string;
  steps: Step[];
  onIntentionChange: (intention: string) => void;
  onAddStep: (text: string) => void;
  onRemoveStep: (id: string) => void;
};

const IntentionCard = ({
  intention,
  steps,
  onIntentionChange,
  onAddStep,
  onRemoveStep,
}: IntentionCardProps) => {
  const [draftStep, setDraftStep] = useState("");

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

      {steps.length > 0 && (
        <ol className="flex flex-col gap-2">
          {steps.map(({ id, text }, index) => (
            <li
              key={id}
              className="flex items-center gap-3 rounded-xl bg-muted px-4 py-2.5"
            >
              <span className="text-sm font-medium text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <span className="flex-1 text-sm">{text}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove step ${text}`}
                onClick={() => onRemoveStep(id)}
              >
                <XIcon />
              </Button>
            </li>
          ))}
        </ol>
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
