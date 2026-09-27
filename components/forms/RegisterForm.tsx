"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useState } from "react";
import { registerAction } from "@/lib/auth/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creating account..." : "Create account"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, action] = useFormState(registerAction, undefined);
  const [role, setRole] = useState<"CUSTOMER" | "PROFESSIONAL">("CUSTOMER");

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-xl font-semibold mb-1">Create your account</h1>
      <p className="text-sm text-ink/70 mb-5">Join Solvify in under a minute.</p>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {(["CUSTOMER", "PROFESSIONAL"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              role === r
                ? "border-primary bg-primary/5 text-primary"
                : "border-gray-200 text-ink/70 hover:border-gray-300"
            }`}
          >
            {r === "CUSTOMER" ? "I need a service" : "I provide a service"}
          </button>
        ))}
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="role" value={role} />
        <Input label="Full name" name="full_name" required autoComplete="name" />
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <Input label="Phone" name="phone" type="tel" required autoComplete="tel" />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
        />

        {state?.error && (
          <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </form>

      <p className="mt-4 text-sm text-center text-ink/70">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
