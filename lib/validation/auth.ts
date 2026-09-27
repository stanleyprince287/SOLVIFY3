import { z } from "zod";

export const registerSchema = z.object({
  full_name: z.string().min(2, "Enter your full name").max(80),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number").max(20),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CUSTOMER", "PROFESSIONAL"])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const forgotSchema = z.object({
  email: z.string().email()
});

export type RegisterInput = z.infer<typeof registerSchema>;