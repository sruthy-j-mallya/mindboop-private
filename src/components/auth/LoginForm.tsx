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
import { useLogin } from "@/tanstack/useAuthQueries";

import { loginSchema } from "./schemas";
import type { LoginFormValues } from "./types";
import { toFieldErrors } from "./utils";

const initialValues: LoginFormValues = { email: "", password: "" };

type LoginFormProps = {
  onSwitchToSignup: () => void;
};

const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const { mutate: login, error, isPending } = useLogin();

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { setErrors }) =>
      login(
        { email: values.email.trim(), password: values.password },
        {
          onError: (error) => setErrors(toFieldErrors<LoginFormValues>(error.details)),
        },
      ),
  });

  // Field-level details are shown inline via Formik; everything else is a form-level message.
  const serverError = error?.kind === "validation" ? undefined : error?.message;
  const fieldError = (field: keyof LoginFormValues) =>
    formik.touched[field] ? formik.errors[field] : undefined;
  const emailError = fieldError("email");
  const passwordError = fieldError("password");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Log in to pick up where you left off.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit} noValidate>
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
              autoComplete="current-password"
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
            {isPending ? "One moment..." : "Log in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="gap-1 text-muted-foreground">
        New to MindBoop?
        <Button type="button" variant="link" className="h-auto p-0" onClick={onSwitchToSignup}>
          Create an account
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
