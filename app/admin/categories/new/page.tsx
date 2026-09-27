import { CategoryForm } from "@/components/forms/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">New category</h1>
      <CategoryForm />
    </div>
  );
}