import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().min(1),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
});

export type RegisterFormData = z.infer<typeof registerSchema>;