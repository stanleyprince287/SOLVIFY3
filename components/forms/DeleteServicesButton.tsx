"use client";

import { deleteServiceAction } from "@/lib/services/actions";
import { Button } from "@/components/ui/Button";

export function DeleteServiceButton({ id }: { id: string }) {
  return (
    <form
      action={deleteServiceAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Delete this service?")) e.preventDefault();
      }}
    >
      <Button variant="danger" type="submit">Delete service</Button>
    </form>
  );
}