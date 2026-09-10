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
import { signUp } from "@/lib/auth";

import AuthBrand from "./AuthBrand";
import { SIGN_UP_INITIAL_VALUES, SIGN_UP_SCHEMA } from "./constants";
import type { AuthFormProps } from "./types";

const SignUp = ({ onSuccess, onSwitch }: AuthFormProps) => {
  const handleSubmit = (
    values: typeof SIGN_UP_INITIAL_VALUES,
    { setFieldError }: FormikHelpers<typeof SIGN_UP_INITIAL_VALUES>
  ) => {
    const result = signUp(values.email, values.password, values.confirmPassword);
    if (!result.ok) {
      if (result.field !== "form") {
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
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Sign up with your email and a password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={SIGN_UP_INITIAL_VALUES}
          validationSchema={SIGN_UP_SCHEMA}
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
            const confirmPasswordError =
              touched.confirmPassword && errors.confirmPassword
                ? errors.confirmPassword
                : "";
            const formError = typeof status === "string" ? status : "";

            return (
              <FormikForm className="flex flex-col gap-6">
                <FieldGroup>
                  <Field data-invalid={emailError ? true : undefined}>
                    <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                    <Input
                      id="signup-email"
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
                    <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={passwordError ? true : undefined}
                    />
                    <FieldError>{passwordError}</FieldError>
                  </Field>
                  <Field data-invalid={confirmPasswordError ? true : undefined}>
                    <FieldLabel htmlFor="signup-confirm-password">
                      Confirm password
                    </FieldLabel>
                    <Input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={confirmPasswordError ? true : undefined}
                    />
                    <FieldError>{confirmPasswordError}</FieldError>
                  </Field>
                </FieldGroup>
                {formError ? <FieldError>{formError}</FieldError> : null}
                <Button type="submit" className="w-full">
                  Sign up
                </Button>
              </FormikForm>
            );
          }}
        </Formik>
      </CardContent>
      <CardFooter className="justify-center">
        <div className="flex flex-wrap items-center justify-center gap-1 text-muted-foreground">
          Already have an account?
          <Button type="button" variant="link" size="sm" onClick={onSwitch}>
            Sign in
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
