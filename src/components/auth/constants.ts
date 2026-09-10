import * as yup from "yup";

const SIGN_IN_SCHEMA = yup.object({
  email: yup
    .string()
    .trim()
    .required("Enter your email.")
    .email("Enter a valid email address."),
  password: yup.string().required("Enter your password."),
});

const SIGN_IN_INITIAL_VALUES = {
  email: "",
  password: "",
};

const SIGN_UP_SCHEMA = yup.object({
  email: yup
    .string()
    .trim()
    .required("Enter your email.")
    .email("Enter a valid email address."),
  password: yup
    .string()
    .required("Enter a password.")
    .min(8, "Password must be at least 8 characters."),
  confirmPassword: yup
    .string()
    .required("Confirm your password.")
    .oneOf([yup.ref("password")], "Passwords do not match."),
});

const SIGN_UP_INITIAL_VALUES = {
  email: "",
  password: "",
  confirmPassword: "",
};

export {
  SIGN_IN_INITIAL_VALUES,
  SIGN_IN_SCHEMA,
  SIGN_UP_INITIAL_VALUES,
  SIGN_UP_SCHEMA,
};
