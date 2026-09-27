import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { DeleteCategoryButton } from "@/components/forms/DeleteCategoryButton";

export default async function EditCategoryPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!category) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit category</h1>
      <CategoryForm category={category} />
      <div className="mt-8 pt-6 border-t border-gray-100">
        <DeleteCategoryButton id={category.id} />
      </div>
    </div>
  );
}