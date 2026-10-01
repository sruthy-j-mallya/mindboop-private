import { arrayMove } from "@dnd-kit/sortable";
import { TimerIcon } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";

import EstimateCard from "./EstimateCard";
import IntentionCard from "./IntentionCard";
import { DURATION_PRESETS } from "./constants";
import type { DurationPreset, Step } from "./types";
import { getDurationMinutes } from "./utils";

const QuickStart = () => {
  const [intention, setIntention] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [presetMinutes, setPresetMinutes] = useState<DurationPreset | null>(DURATION_PRESETS[0]);
  const [customMinutes, setCustomMinutes] = useState("");

  const durationMinutes = getDurationMinutes(presetMinutes, customMinutes);
  const canBegin = intention.trim() !== "" && durationMinutes !== null;

  const selectPreset = (minutes: DurationPreset) => {
    setPresetMinutes(minutes);
    setCustomMinutes("");
  };

  const changeCustomMinutes = (value: string) => {
    setCustomMinutes(value);
    setPresetMinutes(null);
  };

  const addStep = (text: string) => {
    setSteps((current) => [...current, { id: crypto.randomUUID(), text }]);
  };

  const removeStep = (id: string) => {
    setSteps((current) => current.filter((step) => step.id !== id));
  };

  const reorderSteps = (activeId: string, overId: string) => {
    setSteps((current) => {
      const fromIndex = current.findIndex((step) => step.id === activeId);
      const toIndex = current.findIndex((step) => step.id === overId);
      return arrayMove(current, fromIndex, toIndex);
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: start the focus session timer once it exists.
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-10 md:py-14"
    >
      <header className="flex flex-col gap-3">
        <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
          Start with intention
        </span>
        <h1 className="text-3xl tracking-tight md:text-5xl">
          What will be true when this timer ends?
        </h1>
      </header>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          <IntentionCard
            intention={intention}
            steps={steps}
            onIntentionChange={setIntention}
            onAddStep={addStep}
            onRemoveStep={removeStep}
            onReorderSteps={reorderSteps}
          />
        </div>

        <div className="flex flex-col gap-6">
          <EstimateCard
            presetMinutes={presetMinutes}
            customMinutes={customMinutes}
            durationMinutes={durationMinutes}
            onSelectPreset={selectPreset}
            onCustomMinutesChange={changeCustomMinutes}
          />
          <Button
            type="submit"
            size="lg"
            disabled={!canBegin}
            className="h-14 gap-2.5 rounded-2xl text-base [&_svg:not([class*='size-'])]:size-5"
          >
            <TimerIcon />
            Begin session
          </Button>
        </div>
      </div>
    </form>
  );
};

export default QuickStart;
