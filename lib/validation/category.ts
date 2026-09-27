import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required").max(60),
  slug: z.string().min(2, "Slug is required").max(60)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes"),
  description: z.string().max(300).optional().or(z.literal("")),
  icon: z.string().max(8).optional().or(z.literal("")),
  is_active: z.coerce.boolean().optional()
});

export type CategoryInput = z.infer<typeof categorySchema>;