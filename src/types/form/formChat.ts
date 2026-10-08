import z from "zod";

//Formulario para el envio de mensajes al usuario

export const messageSchema = z.object({
  message: z.string().min(1, "El mensaje no puede estar vacío"),
});

export type MessageFormType = z.infer<typeof messageSchema>;

//Formulario para la creacion de chats

export const chatSchema = z.object({
  name: z.string().min(1, "El nombre del usuario no puede estar vacío"),
  phoneNumber: z.string().min(1, "Este campo es obligatorio"),
  countryCode: z.string().min(1, "La lada es obligatoria"),
});

export type ChatFormType = z.infer<typeof chatSchema>;
