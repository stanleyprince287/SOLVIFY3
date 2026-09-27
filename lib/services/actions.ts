"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guard";
import { serviceSchema } from "@/lib/validation/service";

type ActionState = { error?: string; success?: string } | undefined;

export async function createServiceAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireRole("ADMIN");

  const parsed = serviceSchema.safeParse({
    category_id: formData.get("category_id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") ?? "",
    is_active: formData.get("is_active") === "on"
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("services").insert({
    category_id: parsed.data.category_id,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    is_active: parsed.data.is_active ?? true
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/services");
  revalidatePath("/categories");
  return { success: "Service created." };
}

export async function updateServiceAction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireRole("ADMIN");

  const parsed = serviceSchema.safeParse({
    category_id: formData.get("category_id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") ?? "",
    is_active: formData.get("is_active") === "on"
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update({
      category_id: parsed.data.category_id,
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      is_active: parsed.data.is_active ?? true
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/services");
  revalidatePath("/categories");
  return { success: "Service updated." };
}

export async function toggleServiceActiveAction(id: string) {
  await requireRole("ADMIN");

  const supabase = await createClient();
  const { data: current } = await supabase
    .from("services").select("is_active").eq("id", id).single();

  if (!current) return;

  await supabase
    .from("services")
    .update({ is_active: !current.is_active })
    .eq("id", id);

  revalidatePath("/admin/services");
  revalidatePath("/categories");
}

export async function deleteServiceAction(id: string) {
  await requireRole("ADMIN");
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/categories");
}