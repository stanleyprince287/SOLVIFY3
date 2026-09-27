"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guard";
import { categorySchema } from "@/lib/validation/category";

type ActionState = { error?: string; success?: string } | undefined;

export async function createCategoryAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireRole("ADMIN");

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") ?? "",
    icon: formData.get("icon") ?? "",
    is_active: formData.get("is_active") === "on"
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    icon: parsed.data.icon || null,
    is_active: parsed.data.is_active ?? true
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return { success: "Category created." };
}

export async function updateCategoryAction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireRole("ADMIN");

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") ?? "",
    icon: formData.get("icon") ?? "",
    is_active: formData.get("is_active") === "on"
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      icon: parsed.data.icon || null,
      is_active: parsed.data.is_active ?? true
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return { success: "Category updated." };
}

export async function toggleCategoryActiveAction(id: string) {
  await requireRole("ADMIN");

  const supabase = await createClient();
  const { data: current } = await supabase
    .from("categories").select("is_active").eq("id", id).single();

  if (!current) return;

  await supabase
    .from("categories")
    .update({ is_active: !current.is_active })
    .eq("id", id);

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}

export async function deleteCategoryAction(id: string) {
  await requireRole("ADMIN");
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  redirect("/admin/categories");
}