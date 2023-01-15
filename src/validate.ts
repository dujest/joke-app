import { object, string } from "yup";

export const userSchema = object({
  email: string().email(),
  password: string().required(),
  firstName: string().required(),
  lastName: string().required(),
});

export const loginSchema = object({
  email: string().email(),
  password: string().required(),
});
