"use client";

import { useFormState, useFormStatus } from "react-dom";
import { resetPasswordAction } from "@/lib/auth/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Updating..." : "Update password"}
    </Button>
  );
}

export function ResetPasswordForm() {
  const [state, action] = useFormState(resetPasswordAction, undefined);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-xl font-semibold mb-1">Set a new password</h1>
      <p className="text-sm text-ink/70 mb-5">Choose a strong password.</p>

      <form action={action} className="space-y-4">
        <Input
          label="New password"
          name="password"
          type="password"
          required
          minLength={8}
        />
        {state?.error && (
          <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2">
            {state.error}
          </p>
        )}
        <SubmitButton />
      </form>
    </div>
  );
}