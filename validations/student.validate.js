import { z } from "zod";

export const createStudentSchema = z.object({
  firstname: z
    .string()
    .min(3, "First name must be at least 3 characters")
    .max(20, "First name cannot exceed 20 characters")
    .trim(),

  lastname: z
    .string()
    .min(3, "Last name must be at least 3 characters")
    .max(20, "Last name cannot exceed 20 characters")
    .trim(),

  gender: z.enum(["Male", "Female", "Gay"], {
    errorMap: () => ({ message: "Gender must be Male, Female, or Gay" }),
  }),

  email: z.email("Invalid email address").trim(),

  matric_no: z
    .string()
    .min(1, "Matric number is required")
    .regex(
      /^ADUN\/[A-Z]{2,6}\/[A-Z]{2,6}\/\d{2}\/\d{3}$/,
      "Invalid matric number format"
    )
    .trim(),
});

export const updateStudentSchema = createStudentSchema.partial();
