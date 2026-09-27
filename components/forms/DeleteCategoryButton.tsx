"use client";

import { deleteCategoryAction } from "@/lib/categories/actions";
import { Button } from "@/components/ui/Button";

export function DeleteCategoryButton({ id }: { id: string }) {
  return (
    <form
      action={deleteCategoryAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Delete this category and all its services? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <Button variant="danger" type="submit">
        Delete category
      </Button>
    </form>
  );
}