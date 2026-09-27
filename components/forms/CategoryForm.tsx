"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createCategoryAction, updateCategoryAction } from "@/lib/categories/actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils/slug";
import { useState } from "react";
import type { Category } from "@/lib/categories/queries";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  );
}

export function CategoryForm({ category }: { category?: Category }) {
  const isEdit = !!category;
  const router = useRouter();

  const action = isEdit
    ? updateCategoryAction.bind(null, category!.id)
    : createCategoryAction;

  const [state, formAction] = useFormState(action, undefined);

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);

  // Auto-fill slug from name (only for new, until user touches it)
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  // Success → go back to list
  useEffect(() => {
    if (state?.success) {
      router.push("/admin/categories");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="max-w-xl space-y-4 bg-white p-6 rounded-xl shadow-sm">
      <Input
        label="Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="Slug"
        name="slug"
        value={slug}
        onChange={(e) => {
          setSlug(e.target.value);
          setSlugTouched(true);
        }}
        required
      />

      <Input
        label="Icon (emoji, optional)"
        name="icon"
        defaultValue={category?.icon ?? ""}
        maxLength={4}
        placeholder="⚡"
      />

      <Textarea
        label="Description (optional)"
        name="description"
        defaultValue={category?.description ?? ""}
        maxLength={300}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={category?.is_active ?? true}
          className="rounded border-gray-300"
        />
        Active
      </label>

      {state?.error && (
        <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <SubmitButton label={isEdit ? "Save changes" : "Create category"} />
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}