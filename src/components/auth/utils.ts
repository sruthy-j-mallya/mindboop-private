import type { FormikErrors } from "formik";

// Server field errors arrive as arrays; Formik wants one string per field.
export const toFieldErrors = <Values>(
  details: Record<string, string[]> = {},
): FormikErrors<Values> =>
  Object.fromEntries(
    Object.entries(details).map(([field, messages]) => [field, messages.join(" ")]),
  ) as FormikErrors<Values>;
