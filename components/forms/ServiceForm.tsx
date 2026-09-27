"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createServiceAction, updateServiceAction } from "@/lib/services/actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils/slug";
import type { Category } from "@/lib/categories/queries";
import type { Service } from "@/lib/services/queries";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  );
}

export function ServiceForm({
  categories,
  service
}: {
  categories: Category[];
  service?: Service;
}) {
  const isEdit = !!service;
  const router = useRouter();

  const action = isEdit
    ? updateServiceAction.bind(null, service!.id)
    : createServiceAction;

  const [state, formAction] = useFormState(action, undefined);

  const [name, setName] = useState(service?.name ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/services");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="max-w-xl space-y-4 bg-white p-6 rounded-xl shadow-sm">
      <Select
        label="Category"
        name="category_id"
        defaultValue={service?.category_id ?? ""}
        required
      >
        <option value="" disabled>Select a category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.icon ?? ""} {c.name}
          </option>
        ))}
      </Select>

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

      <Textarea
        label="Description (optional)"
        name="description"
        defaultValue={service?.description ?? ""}
        maxLength={300}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={service?.is_active ?? true}
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
        <SubmitButton label={isEdit ? "Save changes" : "Create service"} />
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}