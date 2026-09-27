import { z } from "zod";

export const serviceSchema = z.object({
  category_id: z.string().uuid("Choose a category"),
  name: z.string().min(2, "Name is required").max(80),
  slug: z.string().min(2, "Slug is required").max(80)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes"),
  description: z.string().max(300).optional().or(z.literal("")),
  is_active: z.coerce.boolean().optional()
});

export type ServiceInput = z.infer<typeof serviceSchema>;