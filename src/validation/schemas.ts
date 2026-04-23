import { z } from "zod";

export const userUpdateSchema = z.object({
  fullName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  username: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(20, "El usuario no puede exceder 20 caracteres")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Solo se permiten letras, números y guiones bajos"
    ),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "El formato debe ser AAAA-MM-DD"),
  isPublicProfile: z.boolean(),
  favoritePlantTypes: z
    .array(z.string())
    .min(1, "Selecciona al menos un tipo de planta"),
});

export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

export const plantUpdateSchema = z.object({
  commonName: z
    .string()
    .min(2, "El nombre común debe tener al menos 2 caracteres")
    .max(50, "El nombre común no puede exceder 50 caracteres"),
  scientificName: z
    .string()
    .min(2, "El nombre científico debe tener al menos 2 caracteres")
    .max(80, "El nombre científico no puede exceder 80 caracteres"),
  type: z.string().min(1, "El tipo de planta es requerido"),
  notes: z
    .string()
    .max(500, "Las notas no pueden exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
  isFavorite: z.boolean(),
});

export type PlantUpdateFormData = z.infer<typeof plantUpdateSchema>;
