"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/auth/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Sending..." : "Send reset link"}
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useFormState(forgotPasswordAction, undefined);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-xl font-semibold mb-1">Reset your password</h1>
      <p className="text-sm text-ink/70 mb-5">
        We&apos;ll email you a link to set a new password.
      </p>

      <form action={action} className="space-y-4">
        <Input label="Email" name="email" type="email" required />
        {state?.error && (
          <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="text-sm text-success bg-success/10 rounded-md px-3 py-2">
            {state.success}
          </p>
        )}
        <SubmitButton />
      </form>

      <p className="mt-4 text-sm text-center text-ink/70">
        <Link href="/login" className="text-primary hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}