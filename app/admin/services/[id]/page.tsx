import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllCategories } from "@/lib/categories/queries";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { DeleteServiceButton } from "@/components/forms/DeleteServiceButton";

export default async function EditServicePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!service) notFound();

  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit service</h1>
      <ServiceForm categories={categories} service={service} />
      <div className="mt-8 pt-6 border-t border-gray-100 max-w-xl">
        <DeleteServiceButton id={service.id} />
      </div>
    </div>
  );
}