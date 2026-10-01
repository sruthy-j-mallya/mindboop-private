import * as Yup from "yup";

const email = Yup.string()
  .trim()
  .required("Please enter your email.")
  .email("That doesn't look like an email address.");

export const loginSchema = Yup.object({
  email,
  password: Yup.string().required("Please enter your password."),
});

export const signupSchema = Yup.object({
  name: Yup.string().trim().required("Please tell us what to call you."),
  email,
  password: Yup.string()
    .required("Please choose a password.")
    .min(8, "Password must be at least 8 characters."),
});
