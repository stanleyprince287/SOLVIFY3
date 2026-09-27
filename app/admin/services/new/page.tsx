import { getAllCategories } from "@/lib/categories/queries";
import { ServiceForm } from "@/components/forms/ServiceForm";

export default async function NewServicePage() {
  const categories = await getAllCategories();
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">New service</h1>
      <ServiceForm categories={categories} />
    </div>
  );
}