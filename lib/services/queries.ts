import { createClient } from "@/lib/supabase/server";

export type Service = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

export async function getServicesByCategory(categoryId: string): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("name");

  if (error) throw error;
  return (data ?? []) as Service[];
}

export async function getAllServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("name");

  if (error) throw error;
  return (data ?? []) as Service[];
}