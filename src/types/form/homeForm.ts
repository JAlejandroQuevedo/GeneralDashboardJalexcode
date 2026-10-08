import z from "zod";
//Search form
export const homeSchema = z.object({
  dateMinor: z
    .date()
    .nullable()
    .refine(
      (val) => val !== null && val instanceof Date && !isNaN(val.getTime()),
      {
        message: "La fecha menor es obligatoria",
      }
    ),
  dateMajor: z
    .date()
    .nullable()
    .refine(
      (val) => val !== null && val instanceof Date && !isNaN(val.getTime()),
      {
        message: "La fecha mayor es obligatoria",
      }
    ),
  searchBody: z.string(),
});

export type HomeFormType = z.infer<typeof homeSchema>;

//Popuphome

export const popupHomeSchema = z.object({
  date: z
    .date()
    .nullable()
    .refine(
      (val) => val !== null && val instanceof Date && !isNaN(val.getTime()),
      {
        message: "La fecha es obligatoria",
      }
    ),
  time: z
    .date()
    .nullable()
    .refine(
      (val) => val !== null && val instanceof Date && !isNaN(val.getTime()),
      {
        message: "La hora es obligatoria",
      }
    ),
  product: z.string().min(6, "El texto debe tener al menos 6 caracteres"),
  quantity: z.string().min(1, "El texto debe tener al menos 1 caracter"),
  price: z.string().min(2, "El texto debe tener al menos 2 caracteres"),
  fragil: z.boolean().refine((val) => val === true, {
    message: "Debes llenar el checkbox",
  }),
});

export type PopupHomeForm = z.infer<typeof popupHomeSchema>;
