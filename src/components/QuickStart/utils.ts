import { CUSTOM_DURATION_MAX, CUSTOM_DURATION_MIN } from "./constants";
import type { DurationPreset } from "./types";

export const parseCustomMinutes = (value: string): number | null => {
  if (value.trim() === "") return null;

  const minutes = Number(value);
  const isInRange = minutes >= CUSTOM_DURATION_MIN && minutes <= CUSTOM_DURATION_MAX;

  return Number.isInteger(minutes) && isInRange ? minutes : null;
};

export const getDurationMinutes = (
  presetMinutes: DurationPreset | null,
  customMinutes: string,
): number | null => presetMinutes ?? parseCustomMinutes(customMinutes);
