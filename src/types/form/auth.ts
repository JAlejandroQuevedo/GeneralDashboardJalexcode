import { z } from "zod";

//Login form schema & types
export const authSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es obligatorio"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

export type AuthFormType = z.infer<typeof authSchema>;

//SignUp form schema & types

export const signUpSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  username: z.string().min(8, "El nombre de usuario es obligatorio"),
  email: z.email({ message: "El correo electrónico no es válido" }),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type SignUpFormType = z.infer<typeof signUpSchema>;

//Recovery code email
export const recoveryCodeEmail = z.object({
  username: z.string({ message: "El nombre del usuario no es válido" }),
});

export type RecoveryCodeEmailFormType = z.infer<typeof recoveryCodeEmail>;

//Verification code recovery

export const verificationCodeRecovery = z.object({
  one: z.string().length(1, "El código es obligatorio"),
  two: z.string().length(1, "El código es obligatorio"),
  three: z.string().length(1, "El código es obligatorio"),
  four: z.string().length(1, "El código es obligatorio"),
  five: z.string().length(1, "El código es obligatorio"),
  six: z.string().length(1, "El código es obligatorio"),
});

export type VerificationRecoveryFormType = z.infer<
  typeof verificationCodeRecovery
>;

//Forgot password form schema & types

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "El correo electrónico no es válido" }),
});
export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;

export const forgotConfirmationPasswordSchema = z.object({
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
  confirmPassword: z
    .string()
    .min(4, "La confirmación de contraseña es obligatoria"),
});

export type ForgotConfirmationPasswordFormType = z.infer<
  typeof forgotConfirmationPasswordSchema
>;

//Verification code signUp schema & types
export const verificationCodeSignUpSchema = z.object({
  one: z.string().length(1, "El código es obligatorio"),
  two: z.string().length(1, "El código es obligatorio"),
  three: z.string().length(1, "El código es obligatorio"),
  four: z.string().length(1, "El código es obligatorio"),
  five: z.string().length(1, "El código es obligatorio"),
  six: z.string().length(1, "El código es obligatorio"),
});

export type VerificationCodeSignUpFormType = z.infer<
  typeof verificationCodeSignUpSchema
>;

//Verification code forgot password schema & types
export const verificationForgetSchema = z.object({
  one: z.string().length(1, "El código es obligatorio"),
  two: z.string().length(1, "El código es obligatorio"),
  three: z.string().length(1, "El código es obligatorio"),
  four: z.string().length(1, "El código es obligatorio"),
  five: z.string().length(1, "El código es obligatorio"),
  six: z.string().length(1, "El código es obligatorio"),
});

export type VerificationCodeForgetFormType = z.infer<
  typeof verificationForgetSchema
>;
