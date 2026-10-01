import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

import { CUSTOM_DURATION_MAX, CUSTOM_DURATION_MIN, DURATION_PRESETS } from "./constants";
import type { DurationPreset } from "./types";
import { parseCustomMinutes } from "./utils";

type EstimateCardProps = {
  presetMinutes: DurationPreset | null;
  customMinutes: string;
  durationMinutes: number | null;
  onSelectPreset: (minutes: DurationPreset) => void;
  onCustomMinutesChange: (value: string) => void;
};

const EstimateCard = ({
  presetMinutes,
  customMinutes,
  durationMinutes,
  onSelectPreset,
  onCustomMinutesChange,
}: EstimateCardProps) => {
  const isCustomInvalid = customMinutes !== "" && parseCustomMinutes(customMinutes) === null;
  const rangeLabel = `${CUSTOM_DURATION_MIN}–${CUSTOM_DURATION_MAX} min`;

  return (
    <div className="flex flex-col gap-5 rounded-3xl border bg-card p-6">
      <span
        id="estimate-label"
        className="text-sm font-medium tracking-widest text-muted-foreground uppercase"
      >
        Estimate
      </span>

      <div role="group" aria-labelledby="estimate-label" className="flex flex-wrap gap-2.5">
        {DURATION_PRESETS.map((minutes) => {
          const isSelected = presetMinutes === minutes;

          return (
            <Button
              key={minutes}
              type="button"
              variant="ghost"
              aria-pressed={isSelected}
              aria-label={`${minutes} minutes`}
              onClick={() => onSelectPreset(minutes)}
              className={cn(
                "size-14 rounded-2xl text-base",
                isSelected
                  ? "bg-brand-yellow font-semibold text-foreground hover:bg-brand-yellow dark:text-background"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {minutes}
            </Button>
          );
        })}
        <Input
          type="number"
          inputMode="numeric"
          min={CUSTOM_DURATION_MIN}
          max={CUSTOM_DURATION_MAX}
          step={1}
          aria-label={`Custom duration, ${rangeLabel}`}
          aria-invalid={isCustomInvalid || undefined}
          value={customMinutes}
          onChange={(event) => onCustomMinutesChange(event.currentTarget.value)}
          placeholder={`${CUSTOM_DURATION_MIN}–${CUSTOM_DURATION_MAX}`}
          className={cn(
            "h-14 w-24 rounded-2xl text-center text-base md:text-base",
            customMinutes !== "" && !isCustomInvalid && "border-brand-yellow ring-3 ring-brand-yellow/40",
          )}
        />
      </div>

      <p className={cn("text-muted-foreground", isCustomInvalid && "text-destructive")}>
        {isCustomInvalid
          ? `Custom duration must be ${rangeLabel}`
          : durationMinutes !== null
            ? `${durationMinutes} min`
            : `Pick a duration or enter ${rangeLabel}`}
      </p>
    </div>
  );
};

export default EstimateCard;
