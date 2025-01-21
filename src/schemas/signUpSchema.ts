import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username atleast 2 characters")
  .max(20, "Username must be more than 20 characters");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z.string().min(6, { message: "password must be 6 characters" }),
});
