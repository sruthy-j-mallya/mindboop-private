import { useFormik } from "formik";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useSignup } from "@/tanstack/useAuthQueries";

import { signupSchema } from "./schemas";
import type { SignupFormValues } from "./types";
import { toFieldErrors } from "./utils";

const initialValues: SignupFormValues = { name: "", email: "", password: "" };

type SignupFormProps = {
  onSwitchToLogin: () => void;
};

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const { mutate: signup, error, isPending } = useSignup();

  const formik = useFormik<SignupFormValues>({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: (values, { setErrors }) =>
      signup(
        {
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        },
        {
          onError: (error) => setErrors(toFieldErrors<SignupFormValues>(error.details)),
        },
      ),
  });

  // Field-level details are shown inline via Formik; everything else is a form-level message.
  const serverError = error?.kind === "validation" ? undefined : error?.message;
  const fieldError = (field: keyof SignupFormValues) =>
    formik.touched[field] ? formik.errors[field] : undefined;
  const nameError = fieldError("name");
  const emailError = fieldError("email");
  const passwordError = fieldError("password");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Rabbit holes welcome. Let's get you set up.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit} noValidate>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">What would we call you?</span>
            <Input
              type="text"
              autoComplete="name"
              {...formik.getFieldProps("name")}
              aria-invalid={Boolean(nameError) || undefined}
            />
            {nameError && <span className="text-sm text-destructive">{nameError}</span>}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Email</span>
            <Input
              type="email"
              autoComplete="email"
              {...formik.getFieldProps("email")}
              aria-invalid={Boolean(emailError) || undefined}
            />
            {emailError && <span className="text-sm text-destructive">{emailError}</span>}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Password</span>
            <Input
              type="password"
              autoComplete="new-password"
              {...formik.getFieldProps("password")}
              aria-invalid={Boolean(passwordError) || undefined}
            />
            {passwordError && <span className="text-sm text-destructive">{passwordError}</span>}
          </label>

          {serverError && (
            <p role="alert" className="text-sm text-destructive">
              {serverError}
            </p>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? "One moment..." : "Sign up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="gap-1 text-muted-foreground">
        Already have an account?
        <Button type="button" variant="link" className="h-auto p-0" onClick={onSwitchToLogin}>
          Log in
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
