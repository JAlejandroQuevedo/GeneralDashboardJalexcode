import { z } from "zod";

export const userSchema = z.object({
  email: z.email({ message: "El correo electrónico no es válido" }),
  role: z.string().min(1, { message: "Debes seleccionar un rol" }),
  name: z.string().min(2, { message: "El nombre es obligatorio" }),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    }),
  username: z
    .string()
    .min(3, { message: "El nombre de usuario es obligatorio" })
    .regex(/^[\p{L}\p{M}\p{S}\p{N}\p{P}]+$/u, {
      message:
        "El nombre de usuario contiene caracteres no permitidos (ej. espacios).",
    }),
});

export type UserFormType = z.infer<typeof userSchema>;
