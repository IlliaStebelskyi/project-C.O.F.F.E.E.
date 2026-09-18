import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(4, "String must contain at least 4 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required"),
    password: z.string().min(4, "String must contain at least 4 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;