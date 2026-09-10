import { Formik, Form as FormikForm, type FormikHelpers } from "formik";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { signIn } from "@/lib/auth";

import AuthBrand from "./AuthBrand";
import { SIGN_IN_INITIAL_VALUES, SIGN_IN_SCHEMA } from "./constants";
import type { AuthFormProps } from "./types";

const SignIn = ({ onSuccess, onSwitch }: AuthFormProps) => {
  const handleSubmit = (
    values: typeof SIGN_IN_INITIAL_VALUES,
    { setFieldError, setStatus }: FormikHelpers<typeof SIGN_IN_INITIAL_VALUES>
  ) => {
    setStatus(undefined);
    const result = signIn(values.email, values.password);
    if (!result.ok) {
      if (result.field === "form") {
        setStatus(result.error);
      } else {
        setFieldError(result.field, result.error);
      }
      return;
    }

    onSuccess(result.user);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <AuthBrand />
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in with your email and password to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={SIGN_IN_INITIAL_VALUES}
          validationSchema={SIGN_IN_SCHEMA}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            status,
          }) => {
            const emailError =
              touched.email && errors.email ? errors.email : "";
            const passwordError =
              touched.password && errors.password ? errors.password : "";
            const formError = typeof status === "string" ? status : "";

            return (
              <FormikForm className="flex flex-col gap-6">
                <FieldGroup>
                  <Field data-invalid={emailError ? true : undefined}>
                    <FieldLabel htmlFor="signin-email">Email</FieldLabel>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={emailError ? true : undefined}
                    />
                    <FieldError>{emailError}</FieldError>
                  </Field>
                  <Field data-invalid={passwordError ? true : undefined}>
                    <FieldLabel htmlFor="signin-password">Password</FieldLabel>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={passwordError ? true : undefined}
                    />
                    <FieldError>{passwordError}</FieldError>
                  </Field>
                </FieldGroup>
                {formError ? <FieldError>{formError}</FieldError> : null}
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </FormikForm>
            );
          }}
        </Formik>
      </CardContent>
      <CardFooter className="justify-center">
        <div className="flex flex-wrap items-center justify-center gap-1 text-muted-foreground">
          New here?
          <Button type="button" variant="link" size="sm" onClick={onSwitch}>
            Sign up
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignIn;
